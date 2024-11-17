// components/contact-list.js
class ContactList extends HTMLElement {
  constructor(appService) {
    super();
    this.appService = appService;
    this.contacts = JSON.parse(this.appService.storageService.getItem(`${this.username}-contacts`)) || [];
    this.attachShadow({ mode: 'open' });
    this.handleAddContact = this.handleAddContact.bind(this);
    this.render();
  }

  connectedCallback() {
    // Listen for 'add-contact' events
    window.addEventListener('add-contact', this.handleAddContact);
  }

  disconnectedCallback() {
    // Clean up event listener when component is removed
    window.removeEventListener('add-contact', this.handleAddContact);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Styles here */
        .hidden {
          display: none;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          padding: 5px 0;
        }
        button {
          margin-top: 10px;
        }
      </style>
      <div>
        <h3>${this.appService.username}'s Contacts</h3>
        <input type="file" id="import-file" accept=".json" />
        <button id="import-btn">Import Contact</button>
        <ul id="contact-list">
          ${this.contacts.map((contact) => `<li>${contact.username}</li>`).join('')}
        </ul>
        <button id="back-btn">Back</button>
      </div>
    `;

    this.shadowRoot.getElementById('import-btn').addEventListener('click', () => this.importContact());
    this.shadowRoot.getElementById('back-btn').addEventListener('click', () => this.navigate('dashboard'));
  }

  navigate(view) {
    const event = new CustomEvent('navigate', {
      detail: { view },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  importContact() {
    const fileInput = this.shadowRoot.getElementById('import-file');
    if (fileInput.files.length === 0) {
      alert('Please select a file.');
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const contactInfo = JSON.parse(reader.result);
        if (!contactInfo.username || !contactInfo.publicKey) {
          throw new Error('Invalid contact format.');
        }
        this.addContact(contactInfo);
        alert(`Contact ${contactInfo.username} imported successfully.`);
      } catch (e) {
        alert('Invalid contact file.');
      }
    };
    reader.readAsText(file);
  }

  handleAddContact(event) {
    const contact = event.detail.contact;
    const existingContact = this.contacts.find((c) => c.username === contact.username);
    if (!existingContact) {
      if (confirm(`Accept new contact request from ${contact.username}?`)) {
        this.addContact(contact);
        alert(`Contact ${contact.username} added successfully.`);
      }
    }
  }

  addContact(contact) {
    this.contacts.push(contact);
    this.appService.storageService.setItem(`${this.username}-contacts`, JSON.stringify(this.contacts));
    this.render();
  }
}

customElements.define('contact-list', ContactList);
export {ContactList}