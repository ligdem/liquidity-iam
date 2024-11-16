# Explanation of the files

## index.html

Purpose: Serve as the main entry point and host multiple app instances.

Key Elements:
Include placeholders for multiple app instances.
Load necessary scripts and styles.
Register the service worker for PWA capabilities.

## components/user-login.js
Purpose: Handle user registration and login.

Features:
Generate cryptographic key pairs using Web Crypto API.
Store keys securely in IndexedDB or localStorage.
Dispatch an event upon successful login to load the dashboard.

## components/user-dashboard.js
 
Purpose: Display user information and navigation options.

Features:
Show username and options to navigate to contacts, key recovery, and groups.