import { StorageService } from '../services/storage-service.js'

class UserLogin extends HTMLElement {
    constructor(appService) {
        super();
        this.appService = appService;
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
          /* Styles here */
        </style>
        <form id="login-form">
          <input type="text" id="username" placeholder="Enter username" required />
          <button type="submit">Register / Login</button>
        </form>
      `;

        this.shadowRoot
            .getElementById('login-form')
            .addEventListener('submit', (e) => this.handleLogin(e));
    }

    async handleLogin(event) {
        event.preventDefault();
        const username = this.shadowRoot.getElementById('username').value;
        const loginEvent = new CustomEvent('user-logged-in', { detail: { username } });
        this.dispatchEvent(loginEvent);
    }

}

customElements.define('user-login', UserLogin);
export {UserLogin}