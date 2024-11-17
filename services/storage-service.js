// services/storage-service.js

export class StorageService {
    constructor(useMemory = false) {
        this.useMemory = useMemory;
        if (useMemory) {
            this.memoryStorage = {};
        }
    }

    setRecord(collection, key, value) {
        records = this.getItem(collection) || {};
        records[key] = value;
        this.setItem(collection, records);
    }

    getRecord(collection, key) {
        records = this.getItem(collection) || {};
        return records[key] || null;
    }

    getItem(key) {
        if (this.useMemory) {
            return this.memoryStorage[key] || null;
        } else {
            return localStorage.getItem(key);
        }
    }

    setItem(key, value) {
        if (this.useMemory) {
            this.memoryStorage[key] = value;
        } else {
            localStorage.setItem(key, value);
        }
    }

    removeItem(key) {
        if (this.useMemory) {
            delete this.memoryStorage[key];
        } else {
            localStorage.removeItem(key);
        }
    }

    clear() {
        if (this.useMemory) {
            this.memoryStorage = {};
        } else {
            localStorage.clear();
        }
    }
}
