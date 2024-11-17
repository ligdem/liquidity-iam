// services/communication-service.js

import WebTorrent from 'https://esm.sh/webtorrent';

export class CommunicationService {
  constructor(appService) {
    this.appService = appService;
    this.client = new WebTorrent(); // Use the imported WebTorrent
    this.peers = {}; // Store peers by username
    this.eventHandlers = {}; // For custom event handling
    this.createAndAnnounceTorrent(this.appService.getPublicKey());
  }

  registerInfoHash(key, infoHash) {
    if( this.appService.keyManagementService.getKeyAsString(key) === this.appService.keyManagementService.getKeyAsString(this.appService.getPublicKey()) ) {
      this.appService.setInfoHash(infoHash);
    }
  }

  async createAndAnnounceTorrent(publicKey) {
    const file = this.appService.keyManagementService.getKeyAsFile(publicKey);
    this.client.seed(file, (torrent) => {
      console.log('Seeded and announced new torrent:', torrent.infoHash);
      this.registerInfoHash(publicKey, torrent.infoHash);
      // Log when the torrent is ready
      torrent.on('ready', () => {
        console.log('Torrent is ready:', torrent.infoHash);
      });
  
      // Log download progress
      torrent.on('download', (bytes) => {
        console.log('Downloaded:', bytes, 'bytes. Total downloaded:', torrent.downloaded);
      });
  
      // Log upload progress
      torrent.on('upload', (bytes) => {
        console.log('Uploaded:', bytes, 'bytes. Total uploaded:', torrent.uploaded);
      });
  
      // Log when the torrent is done downloading
      torrent.on('done', () => {
        console.log('Torrent download is done:', torrent.infoHash);
      });
  
      // Log error events
      torrent.on('error', (err) => {
        console.error('Error with torrent:', torrent.infoHash, 'Error:', err);
      });
  
      // Log wire events for peer connections
      torrent.on('wire', (wire, addr) => {
        console.log('Connected to peer:', addr, 'for torrent:', torrent.infoHash);
  
        // Detect when a peer tries to download the torrent
        wire.on('download', (bytes) => {
          console.log(`Peer ${addr} downloaded ${bytes} bytes from this torrent.`);
        });
  
        wire.on('upload', (bytes) => {
          console.log(`Uploaded ${bytes} bytes to peer ${addr}.`);
        });
  
        // Optional: listen for requests and other peer communication events
        wire.on('request', (index, offset, length) => {
          console.log(`Peer ${addr} requested piece index: ${index}, offset: ${offset}, length: ${length}`);
        });
      });
  
      // Add additional handlers as needed
    });
  }

  async startPeerDiscovery(infoHash) {
    const magnetURI = `magnet:?xt=urn:btih:${infoHash}`;

    // Attempt to join the swarm
    this.client.add(magnetURI, (torrent) => {
      console.log('Connected to swarm with info hash:', infoHash);

      torrent.on('wire', (wire) => {
        console.log('New peer connected');
        clearTimeout(peerCheckTimeout); // Clear timeout when a peer connects

        const peerUsername = wire.peerId.toString('hex');
        this.peers[peerUsername] = wire;

        wire.on('data', async (data) => {
          await this.handleIncomingData(data, peerUsername);
        });

        this.sendGreeting(wire);
      });
    });
  }



  async computeInfoHash(publicKey) {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(publicKey));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  on(eventType, handler) {
    this.eventHandlers[eventType] = handler;
  }

  emit(eventType, data) {
    if (this.eventHandlers[eventType]) {
      this.eventHandlers[eventType](data);
    }
  }

  async sendGreeting(wire) {
    const messageContent = {
      type: 'greeting',
      from: this.username,
      publicKey: this.publicKey,
      timestamp: Date.now(),
    };

    await this.sendSignedMessage(wire, messageContent);
  }

  async sendSignedMessage(wire, messageContent) {
    const messageString = JSON.stringify(messageContent);

    // Sign the message
    const signature = await this.keyManagementService.signMessage(messageString, this.privateKey);

    // Create the signed message
    const signedMessage = {
      message: messageContent,
      signature: Array.from(new Uint8Array(signature)),
    };

    // Send the message via the wire
    wire.send(Buffer.from(JSON.stringify(signedMessage)));
  }

  async sendSignedMessageToPeer(peerUsername, messageContent) {
    const wire = this.peers[peerUsername];
    if (wire) {
      await this.sendSignedMessage(wire, messageContent);
    } else {
      console.warn(`No connection to peer ${peerUsername}`);
    }
  }

  async handleIncomingData(data, peerUsername) {
    try {
      const dataString = data.toString();
      const receivedData = JSON.parse(dataString);

      const message = receivedData.message;
      const signatureArray = receivedData.signature;

      // Reconstruct signature buffer
      const signature = new Uint8Array(signatureArray).buffer;

      // Determine the sender's public key
      const senderPublicKey = message.publicKey;

      // Verify the signature
      const messageString = JSON.stringify(message);
      const isValid = await this.keyManagementService.verifySignature(
        messageString,
        signature,
        senderPublicKey
      );

      if (!isValid) {
        if (this.isTest) {
          alert(`Invalid signature from ${message.from}`);
        }
        return; // Ignore invalid messages
      }

      // Handle the message based on its type
      switch (message.type) {
        case 'greeting':
          this.emit('greeting', message);
          break;
        case 'key-part-request':
          this.handleKeyPartRequest(message, peerUsername);
          break;
        case 'key-part-response':
          this.emit('key-part-response', receivedData);
          break;
        case 'key-part-share':
          this.handleKeyPartShare(message);
          break;
        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling incoming data:', error);
      if (this.isTest) {
        alert('Received invalid message format.');
      }
    }
  }

  async handleKeyPartRequest(message, peerUsername) {
    // Prompt the user to approve sending their key part
    if (confirm(`${message.from} is requesting a key part for recovery. Provide key part?`)) {
      // Simulate generating a key part
      const keyPart = this.keyManagementService.getKeyPart(peerUsername);

      // Prepare the response message
      const responseMessageContent = {
        type: 'key-part-response',
        from: this.publicKey,
        to: message.from,
        keyPart: keyPart,
        timestamp: Date.now(),
      };

      await this.sendSignedMessageToPeer(peerUsername, responseMessageContent);
    }
  }

  handleKeyPartShare(message) {
    // Emit an event to notify the components that a key part has been shared
    this.emit('key-part-share', message);
  }

  async shareKeyParts(contacts, privateKeyJwk) {
    try {
      await this.keyManagementService.shareKeyParts(contacts, privateKeyJwk);
    } catch (error) {
      // Handle error and display an alert
      console.error('Error sharing key parts:', error);
      alert('An error occurred while sharing key parts. Please try again.');
    }
  }
}
