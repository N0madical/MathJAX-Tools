//########################################################
    //Storage.js Javascript package - By Aiden C
//########################################################

//Browser Storage object: Handles storing and retreiving browser storage items
//storage_types: sync, local
function extentionStorage(name, storageType, defaultValue = []) {
    this.name = name;
    this.value = defaultValue;
    this.defaultValue = defaultValue;
    this.sync = (storageType == "sync") ? true:false;

    let storageapi = (typeof browser !== "undefined") ? browser:chrome;

    this.get = function(...onCompleteFunctions) {
        try {
            if(typeof browser !== "undefined") {
                if(this.sync) {
                    browser.storage.sync.get(`${this.name}`).then(data => {this.internalGet(data, onCompleteFunctions)}, this.error)
                } else {
                    browser.storage.local.get(`${this.name}`).then(data => {this.internalGet(data, onCompleteFunctions)}, this.error)
                }
            } else {
                if(this.sync) {
                    chrome.storage.sync.get(`${this.name}`, data => {this.internalGet(data, onCompleteFunctions)})
                } else {
                    chrome.storage.local.get(`${this.name}`, data => {this.internalGet(data, onCompleteFunctions)})
                }
            }
        } catch (error) {
            console.error(`Storage.js: Error retreiving browser storage for '${this.name}'\nIs Cloud Storage: ${this.sync}\nError: ${error}`)
        }
    };

    this.set = function(value=null) {
        try{
            if(value != null) {
                this.value = value
            }
            let parsevalue = JSON.stringify(this.value)
            if(this.sync) {
                storageapi.storage.sync.set({[this.name]:parsevalue})
            } else {
                storageapi.storage.local.set({[this.name]:parsevalue})
            }
        } catch (error) {
            console.error(`Storage.js: Error setting browser storage for '${this.name}'\nIs Cloud Storage: ${this.sync}\nError: ${error}`)
        }
    };

    this.clear = function() {
        try{
            if(this.sync) {
                storageapi.storage.sync.remove(`${this.name}`)
            } else {
                storageapi.storage.local.remove(`${this.name}`)
            }
        } catch (error) {
            console.error(`Storage.js: Error clearing browser storage for '${this.name}'\nIs Cloud Storage: ${this.sync}\nError: ${error}`)
        }
    }

    let self = this

    this.internalGet = function(value, runAfter) {
        if(value[self.name] == undefined) {
            self.value = self.defaultValue
            if(self.sync) {
                console.debug("Storage.js: Value was undefined, Sync setting:", self.name)
                storageapi.storage.sync.set({[name]:self.value})
            } else {
                storageapi.storage.local.set({[name]:self.value})
            }
        } else {
            self.value = JSON.parse(value[self.name])
        }
        if(runAfter) {for(self.i = 0; self.i < runAfter.length; self.i++) {
                try {
                    console.debug(runAfter)
                    runAfter[self.i]()
                } catch (error) {
                    console.error("Storage.js: Tried to run invalid function with error\n-----\n", runAfter[self.i], "\n-----\n", error ,"\n-----\nafter getting variable", self.name)
                }
        }   }
        return self.value
    };

    this.error = function(value) {
        console.error(`Storage.js: (Catch-All) Browser storage ${name} had error: ${value}`)
    }
}