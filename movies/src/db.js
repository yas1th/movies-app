import { STORE_MODES } from "./global.constants";

var createDBInstance = function(dbName, dbStoreName, version) {
    var db;
    return {
        init: function(successCB) {
            console.log('Opening the DB', dbName, version);
            const DBOpenRequest = window.indexedDB.open(dbName, version);
            DBOpenRequest.onerror = (event) => {
                console.log(`Error loading the database: ${dbName}`);
                successCB([]);
            }
            DBOpenRequest.onsuccess = (event) => {
                console.log(`${dbName} Database Initialized successfully`);
                db = DBOpenRequest.result;
                const dbStore = db.transaction(dbStoreName, STORE_MODES.READ).objectStore(dbStoreName);
                dbStore.getAll().onsuccess = function() {
                    let listOfTitles = [];
                    for(let i = 0; i < this.result.length; i++) {
                        listOfTitles.push(this.result[i].movieTitle)
                    }
                    successCB(listOfTitles);
                };
            }

            // This event handles the event whereby a new version of the database needs to be created
            // Either one has not been created before, or a new version number has been submitted via the
            // window.indexedDB.open line above
            DBOpenRequest.onupgradeneeded = (event) => {
                db = event.currentTarget.result;
                db.onerror = (event) => {
                    console.log(`Error loading the database: ${event}`);
                }
                // creating an object store for this databse
                const dbStore = db.createObjectStore(dbStoreName, {keyPath: 'id', autoIncrement: true})
                dbStore.createIndex('title', 'title', {unique: false});
                console.log('object store created');
            }
            
        },
        insert: (colName, value) => {
            console.log('Insert DB Fn called', colName, value);
            let req;
            // store the result of opening the database in the db variable.
            // This is used a lot below
            const newRecord = {[colName]: value}
            const transaction = db.transaction(dbStoreName, STORE_MODES.READ_WRITE);
            const dbStore = transaction.objectStore(dbStoreName);
            try{
                req = dbStore.add(newRecord);
            }catch(ex) {
                if(ex.name === 'DataCloneError') {
                    console.log("This engine doesn't know how to clone a Blob, " +
                             "use Firefox")
                }else {
                    console.log('exeption occured inserting the object into the store', ex);
                }
                throw ex;
            }
            req.onsuccess = function (evt) {
                console.log("Insertion in DB successful");
            };
            req.onerror = function() {
                console.error("error inserting the data", this.error);
            };
        }
    }
}

export default createDBInstance;
