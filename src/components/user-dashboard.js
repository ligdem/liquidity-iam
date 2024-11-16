// components/user-dashboard.js

import { WebRTCCommunication } from './webrtc-communication.js';

class UserDashboard extends HTMLElement {
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
      <div>
        <h2>Welcome, ${this.appService.username}</h2>
        <button id="contacts-btn">Contacts</button>
        <button id="profile-btn">Profile</button>
        <!-- Components -->
        <div id="webrtc-container"></div>
      </div>
    `;

    // Initialize WebRTCCommunication if not already initialized
    if (!this.webrtcComm) {
      this.webrtcComm = new WebRTCCommunication(this.appService);
    }

    const webrtcContainer = this.shadowRoot.getElementById('webrtc-container');
    webrtcContainer.appendChild(this.webrtcComm);

    // Event listeners for navigation buttons
    this.shadowRoot
    .getElementById('contacts-btn')
    .addEventListener('click', () => this.navigate('contacts'));
    this.shadowRoot
    .getElementById('profile-btn')
    .addEventListener('click', () => this.navigate('profile'));
  }

  navigate(view) {
    // Dispatch a navigation event
    const event = new CustomEvent('navigate', {
      detail: { view },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

customElements.define('user-dashboard', UserDashboard);
export {UserDashboard}