// services/key-management-service.js

export class KeyManagementService {
    constructor(storageService) {
        this.storageService = storageService;
    }

    async getPublicKey(username) { 
        return await this.storageService.getItem(`${username}-publicKey`);
    }

    async getPrivateKey(username) {
        return  await this.storageService.getItem(`${username}-privateKey`);
    }

    async login(username) {
        // Check if keys already exist
        if (!this.storageService.getItem(`${username}-privateKey`)) {
            // Generate new key pair
            const { privateKey, publicKey } = await this.generateKeyPair();

            // Store keys in storage
            this.storage.setItem(`${username}-privateKey`, JSON.stringify(privateKey));
            this.storage.setItem(`${username}-publicKey`, JSON.stringify(publicKey));
        }
    }

    async generateKeyPair() {
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: 'ECDSA',
                namedCurve: 'P-256',
            },
            true,
            ['sign', 'verify']
        );

        const privateKey = await window.crypto.subtle.exportKey('jwk', keyPair.privateKey);
        const publicKey = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);

        return { privateKey, publicKey };
    }

    getKeyAsString(publicKey) {
        return JSON.stringify(publicKey);
    }

    getKeyAsFile(publicKey) {
        return new Blob([this.getKeyAsString(publicKey)], { type: 'application/json' });
    }

    async signMessage(message, privateKeyJwk) {
        const privateKey = await crypto.subtle.importKey(
            'jwk',
            privateKeyJwk,
            {
                name: 'ECDSA',
                namedCurve: 'P-256',
            },
            false,
            ['sign']
        );

        const encoder = new TextEncoder();
        const data = encoder.encode(message);

        const signature = await crypto.subtle.sign(
            {
                name: 'ECDSA',
                hash: { name: 'SHA-256' },
            },
            privateKey,
            data
        );

        return signature;
    }

    async verifySignature(message, signature, publicKeyJwk) {
        const publicKey = await crypto.subtle.importKey(
            'jwk',
            publicKeyJwk,
            {
                name: 'ECDSA',
                namedCurve: 'P-256',
            },
            false,
            ['verify']
        );

        const encoder = new TextEncoder();
        const data = encoder.encode(message);

        const isValid = await crypto.subtle.verify(
            {
                name: 'ECDSA',
                hash: { name: 'SHA-256' },
            },
            publicKey,
            signature,
            data
        );

        return isValid;
    }

    async getKeyPart(peerUsername) {
        return storageService.getRecord('key_part', peerUsername);
    }

    async shareKeyParts(contacts, privateKeyJwk) {
        if (contacts.length < 3) {
            throw new Error('You need at least 3 trusted contacts to share key parts.');
        }

        // Split the private key into parts
        const keyParts = await this.splitKey(privateKeyJwk, 3);

        // Send each key part to a contact
        for (let i = 0; i < keyParts.length; i++) {
            const contact = contacts[i % contacts.length]; // Distribute parts among contacts

            const messageContent = {
                type: 'key-part-share',
                from: this.publicKey,
                to: contact.username,
                keyPart: keyParts[i],
                index: i + 1,
                length: keyParts.length,
                timestamp: Date.now(),
            };

            await this.sendSignedMessageToPeer(contact.username, messageContent);
        }

        // Instead of alert, throw an exception to signal success, or simply return.
        console.log('Key parts have been shared with your trusted contacts.');
    }

    async splitKey(privateKeyJwk, parts) {
        // For demonstration, we'll simulate key splitting by dividing the key JSON into parts.
        // In a real implementation, you would use Shamir's Secret Sharing.

        const privateKeyString = JSON.stringify(privateKeyJwk);
        const partLength = Math.ceil(privateKeyString.length / parts);
        const keyParts = [];

        for (let i = 0; i < parts; i++) {
            const part = privateKeyString.slice(i * partLength, (i + 1) * partLength);
            keyParts.push(part);
        }

        return keyParts;
    }

}