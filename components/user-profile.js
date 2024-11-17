class UserProfile extends HTMLElement {
  constructor(appService) {
    super();
    this.appService = appService;
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.loadProfile();
  }


  render() {
    this.shadowRoot.innerHTML = `
        <style>
          /* Styles here */
        </style>
        <form id="profile-form">
          username:<input type="text" id="username" required /><br>
          public key:<input type="text" id="public-key"  /><br>
          private key:<input type="text" id="private-key"  /><br>
          <button type="submit">Update</button>
        </form><br>
          <button id="key-recovery-btn">Key Recovery</button><br>
          <button id="back-btn">Back</button>
      `;

    this.shadowRoot.getElementById('profile-form').addEventListener('submit', (e) => this.handleUpdate(e));
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

  async handleUpdate(event) {
    event.preventDefault();
    const username = this.shadowRoot.getElementById('username').value;
    this.storage.setRecord('profile', 'username', username)
  }

  async loadProfile() {
    if (this.shadowRoot) {
      this.shadowRoot.getElementById('username').value = this.appService.username || '';
      this.shadowRoot.getElementById('public-key').value = this.appService.getPublicKey() || '';
      this.shadowRoot.getElementById('private-key').value = this.appService.getPrivateKey() || '';
    }
  }
}


customElements.define('user-profile', UserProfile);
export { UserProfile }