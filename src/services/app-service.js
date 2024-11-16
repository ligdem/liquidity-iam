import { StorageService } from "./storage-service.js";
import { KeyManagementService } from "./key-management-service.js";
import { CommunicationService } from "./communication-service.js";

export class AppService {
  constructor(isTest = false) {
    this.isTest = isTest;
    this.username = null;
    this.storageService = null;
    this.keyManagementService = null;
    this.communicationService = null;
    this.publicKey = null;
    this.privateKey = null;
   }

   async loggedIn(username){
    this.username = username;
    this.storageService = new StorageService(this.isTest);
    this.keyManagementService = new KeyManagementService(this.storageService);
    this.communicationService = new CommunicationService(this);
    this.keyManagementService.login(username);
    this.publicKey = await this.keyManagementService.getPublicKey(this.username);
    this.privateKey = await this.keyManagementService.getPrivateKey(this.username);
   }

   getPublicKey(){
    if(!this.username){
      throw new Error("User not logged in");
    }
    return this.publicKey;
   }

   getPrivateKey() {
    if(!this.username){
        throw new Error("User not logged in");
      }
      return this.privateKey;
   }

   setInfoHash(infoHash){
    this.infoHash = infoHash;
   }

   getInfoHash(){
    return this.infoHash;
   }
}