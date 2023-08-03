class LocalStorageManager {
    static instance;

    static getInstance() {
        if (!LocalStorageManager.instance) {
            LocalStorageManager.instance = new LocalStorageManager();
        }
        return LocalStorageManager.instance;
    }

    getItem(key) {
        const value = localStorage.getItem(key);
        return JSON.parse(value);
    }

    setItem(key, value) {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    }

    removeItem(key) {
        localStorage.removeItem(key);
    }
}

export default LocalStorageManager;
