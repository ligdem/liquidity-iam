## 1. Liquidity Identity Management Overview

### Key Concepts:
- **Decentralized Identity (DID)**: Users generate their own public/private key pairs on their device.
- **Self-Sovereign Identity (SSI)**: Users fully own and control their identity data, without reliance on centralized authorities.
- **Interoperability**: Compatibility with standards like OAuth, Fediverse protocols (e.g., ActivityPub), and decentralized identity standards (e.g., W3C DIDs).
- **User Groups**: Groups of users who share resources, manage access policies, and collaborate. Groups have their own internal governance and membership policies.
- **Role-Based Access Control (RBAC)**: Define roles within groups to manage permissions for users.

---

## 2. Core Identity Management Features

### a) Decentralized User Registration and Key Generation
- **Key Generation**: Users generate a cryptographic key pair on their device using algorithms like RSA, ECDSA, or EdDSA.
- **Identity Document**: A Decentralized Identifier (DID) document containing:
  - Public key
  - Supported cryptographic algorithms
  - Metadata (e.g., username, device information)
- **Storage**: The private key remains securely stored on the user's device. The public key is shared with the network for identity verification.

### b) Contacts & Address Book
- Users can associate public keys with contact information (e.g., usernames, email addresses) and build a contact list.
- The contact list is encrypted and stored locally on the user's device, ensuring privacy.
- Users can exchange public keys via QR codes, NFC, or other P2P methods.

---

## 3. Private Key Recovery via User Groups

### a) Key Splitting & Secure Distribution
- **Shamir's Secret Sharing**: The private key is split into multiple parts using an algorithm like Shamir’s Secret Sharing. Each part is distributed to trusted group members.
- **Threshold Recovery**: To recover the private key, the user needs to request key parts from a minimum number of group members (e.g., 3 out of 5).
- **Physical Verification**: Before sending the key part, group members verify the requester's identity (using video call, physical meeting, or other agreed-upon methods).

### b) Key Management Standards
- **Algorithm Agnosticism**: Include metadata specifying the cryptographic algorithm used for each key. This ensures compatibility with different systems and standards.
- **Interoperability**: The DID document should be formatted to support widely recognized standards (e.g., W3C DID, JSON Web Key [JWK] format).

---

## 4. User Groups and Role-Based Access Control

### a) User Group Architecture
- **Group Identity**: Each user group has its own DID and public/private key pair.
- **Shared Storage**: Groups can allocate shared storage space (on IPFS, Arweave, or other decentralized storage solutions) for documents, messages, and member information.
- **Membership Policies**: Define rules for:
  - **Onboarding**: Criteria for accepting new members (e.g., invitation, majority vote).
  - **Exclusion**: Rules for removing members (e.g., misconduct, inactivity).
- **Interoperability**: Support for integrating with existing platforms like Matrix (decentralized chat) or Fediverse instances.

### b) Roles and Permissions
- **Roles**: Predefined roles (e.g., Admin, Moderator, Member) to manage permissions within the group.
- **Permissions Matrix**: Assign permissions to roles for actions like:
  - Viewing group documents
  - Submitting or approving proposals
  - Managing membership
- **Flexible Role Assignment**: Allow dynamic creation of custom roles with specific permissions.

---

## 5. Interoperability and Integration with External Systems

### a) Compatibility
- **OAuth Integration**: Support for federated login via OAuth 2.0 for interoperability with traditional web applications.
- **ActivityPub & Fediverse Compatibility**: Allow user groups to interact with other Fediverse services, enabling cross-platform collaboration.
- **Bridging Protocols**: Develop bridges to connect with existing IAM systems like Keycloak or DIDComm for decentralized communication.

### b) Protocol Support
- **Libp2p/WebRTC**: For P2P communication between users, enabling direct messaging and decentralized group management.
- **DIDs & Verifiable Credentials**: Use W3C DID and Verifiable Credentials (VCs) standards to issue credentials within the platform (e.g., proof of group membership).

---

## 6. Technical Implementation Plan

### a) Technology Stack
- **Cryptography**: `WebCrypto API` for key management.
- **Blockchain**: Liquichain for immutability and audit logs.
- **P2P Communication**: `WebRTC`
- **Decentralized Storage**: local storage on user devices, integration with external storage (DB, drive, s3,...).

### b) APIs & SDKs
- **Identity Management API**: For registering users, managing DIDs, and key recovery.
- **Group Management API**: For creating groups, managing roles, and handling membership.
- **Notification System API**: For sending reminders and alerts via decentralized channels.

--- 

## 7. Design overview

Goals:

- **No Compilation Needed**: Use plain JavaScript and standard web APIs.
- **Deployable on GitHub Pages**: Host the app directly from the repository.
- **Installable as PWA**: Enable users to install the app on mobile devices.
- **Multiple Instances for Testing**: Run several app instances on one page.
- **Use Web Components**: Ensure modularity and reusability.

Core Features to Implement:

- **User Registration and Key Pair Generation**: Allow users to create accounts and generate DID and key pairs.
- **Contact Management**: Enable users to exchange public keys with other users.
- **Key Splitting and Recovery**
- **User Groups with Roles**
- **P2P Communication Simulation Between Instances**