// components/app-root.js

import { UserLogin } from './user-login.js';
import { UserDashboard } from './user-dashboard.js';
import { ContactList } from './contact-list.js';
import { UserProfile } from './user-profile.js';
import { AppService } from '../services/app-service.js';  

class AppRoot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.appService = new AppService(this.hasAttribute('test'));
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Styles here */
      </style>
      <div id="app-container"></div>
    `;

    // Initialize components
    this.components = {};

    // Start with the login component
    this.showLogin();
  }

  showLogin() {
    const appContainer = this.shadowRoot.getElementById('app-container');
    appContainer.innerHTML = ''; // Clear existing content

    const userLogin = new UserLogin(this.appService);
    if (this.isTest) userLogin.setAttribute('test', '');

    userLogin.addEventListener('user-logged-in', (e) => {
      this.appService.loggedIn(e.detail.username);
      this.showDashboard();
    });

    appContainer.appendChild(userLogin);
  }

  handleNavigation(detail) {
    switch (detail.view) {
      case 'contacts':
        this.showContacts();
        break;
      case 'dashboard':
        this.showDashboard();
        break;
      case 'profile':
        this.showProfile();
      default:
        break;
    }
  }

  showDashboard() {
    const appContainer = this.shadowRoot.getElementById('app-container');
    appContainer.innerHTML = ''; // Clear existing content

    // Check if dashboard already exists
    if (!this.components.dashboard) {
      const userDashboard = new UserDashboard(this.appService);
      userDashboard.addEventListener('navigate', (e) => this.handleNavigation(e.detail));
      this.components.dashboard = userDashboard;
    }

    appContainer.appendChild(this.components.dashboard);
  }

  showContacts() {
    const appContainer = this.shadowRoot.getElementById('app-container');
    appContainer.innerHTML = ''; // Clear existing content

    // Check if contact list already exists
    if (!this.components.contactList) {
      const contactList = new ContactList(this.appService);
      contactList.addEventListener('navigate', (e) => this.handleNavigation(e.detail));
      this.components.contactList = contactList;
    }

    appContainer.appendChild(this.components.contactList);
  }
  
  showProfile() {
    const appContainer = this.shadowRoot.getElementById('app-container');
    appContainer.innerHTML = ''; // Clear existing content

    // Check if userProfile already exists
    if (!this.components.userProfile) {
      const userProfile = new UserProfile(this.appService);
      userProfile.addEventListener('navigate', (e) => this.handleNavigation(e.detail));
      this.components.userProfile = userProfile;
    }

    appContainer.appendChild(this.components.userProfile);
  }
}

customElements.define('app-root', AppRoot);
