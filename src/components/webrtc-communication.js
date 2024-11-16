// components/webrtc-communication.js

class WebRTCCommunication extends HTMLElement {
  constructor(appService) {
    super();
    this.appService=appService;
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    // Set up event handlers
    this.appService.communicationService.on('greeting', (message) => this.handleGreeting(message));
    this.appService.communicationService.on('key-part-response', (data) => this.handleKeyPartResponse(data));
    this.appService.communicationService.on('key-part-share', (message) => this.handleKeyPartShare(message));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Styles here */
        #status {
          margin-top: 10px;
        }
      </style>
      <div>
        <h3>WebRTC Communication for ${this.username}</h3>
        <div id="status">Initializing...</div>
      </div>
    `;
  }

  handleGreeting(message) {
    // Dispatch an event to add the contact
    const addContactEvent = new CustomEvent('add-contact', {
      detail: {
        contact: {
          username: message.from,
          publicKey: message.publicKey,
        },
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(addContactEvent);
  }

  handleKeyPartResponse(data) {
    // Handle the key part response event
    const event = new CustomEvent('key-part-response', {
      detail: data,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  handleKeyPartShare(message) {
    // Store the received key part
    const keyParts = JSON.parse(
      this.appService.storageService.getItem(`${this.username}-keyParts`) || '[]'
    );
    keyParts.push({
      from: message.from,
      keyPart: message.keyPart,
      index: message.index,
      length: message.length,
    });
    this.appService.storageService.setItem(`${this.username}-keyParts`, JSON.stringify(keyParts));

    alert(`Received key part ${message.index}/${message.length} from ${message.from}.`);
  }

  async shareKeyParts() {
    // Get contacts from storage
    const contacts = JSON.parse(
      this.appService.storageService.getItem(`${this.username}-contacts`) || '[]'
    );

    // Share key parts using the communication service
    await this.appService.communicationService.shareKeyParts(contacts, this.privateKey);
  }
}

customElements.define('webrtc-communication', WebRTCCommunication);

export {WebRTCCommunication}