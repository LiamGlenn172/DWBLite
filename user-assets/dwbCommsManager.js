var CommsManager = (function () {
    function CommsManager() {
        var _this = this;
        console.log('Comms Manager loaded');
        if (window.cti.store.env.platform.type !== 'desktop') {
            window.plugins.notify.receiveInboxChanges('', function (r, message) { return _this.processInboxChange(r, message); });
            window.plugins.notify.receiveOutboxChanges('', function (r, message) { return _this.processMessageResponse(r, message); });
        }
    }
    CommsManager.prototype.updateQueue = function (queue) {
        window.cti.store.messageQueue = queue;
    };
    CommsManager.prototype.getQueue = function () {
        if (window.cti.store.messageQueue !== undefined)
            return window.cti.store.messageQueue;
        else
            return [];
    };
    CommsManager.prototype.getMessageQueueCount = function () {
        return this.messageQueue.length;
    };
    CommsManager.prototype.addToQueue = function (message) {
        this.messageQueue = this.getQueue();
        var id = this.generateUUID();
        message.payload.commsManagerId = id;
        this.messageQueue.push(message);
        this.updateQueue(this.messageQueue);
        return id;
    };
    CommsManager.prototype.sendMessage = function (endpoint, message) {
        console.log('SENDING MESSAGE to: %s. Remaining messages on device: %s', endpoint, this.getMessageQueueCount());
        if (endpoint == 'sendDwbPhoto') {
            var options = {
                "name": "dwbService",
                "operation": endpoint,
                "params": {
                    "payload": message.payload,
                    "photoRef": message.payload.photoRef
                },
            };
            if (message.actions !== undefined)
                options.actions = message.actions;
            window.cti.utils.callAction('call-azure-app-service', options);
        }
        else {
            var options = {
                "name": "dwbService",
                "operation": endpoint,
                "params": {
                    "payload": message.payload
                }
            };
            if (message.actions !== undefined)
                options.actions = message.actions;
            window.cti.utils.callAction('call-azure-app-service', options);
        }
    };
    CommsManager.prototype.processQueue = function () {
        this.messageQueue = this.getQueue();
        if (this.messageQueue.length > 0)
            this.sendMessage(this.messageQueue[0].endpoint, this.messageQueue[0]);
    };
    CommsManager.prototype.processMessageResponse = function (err, message) {
        this.messageQueue = this.getQueue();
        this.updateQueue(this.messageQueue);
        var loader = document.querySelector('#' + cti.store.state.currentPage + ' activity-loader');
        if (message.action.indexOf('FAIL') > -1) {
            if (window.localStorage['reconciling'] === "true") {
                delete window.localStorage['reconciling'];
            }
            console.log(message.action + ': ' + JSON.stringify(message.message));
            if (loader !== undefined)
                loader.hide();
        }
        else {
            if (this.messageQueue.length > 0) {
                var messageId = message.message.content.data.payload.commsManagerId;
                console.log('Processing response for message: %s', messageId);
                var res = window.jQuery.grep(this.messageQueue, function (e) {
                    return (e.payload.commsManagerId === messageId);
                });
                if (res.length > 0) {
                    for (var r = 0; r < res.length; r++) {
                        for (var i = 0; i < this.messageQueue.length; i++) {
                            if (this.messageQueue[i].payload.commsManagerId == res[r].payload.commsManagerId) {
                                if (this.messageQueue[i].endpoint === 'sendDwbPhoto') {
                                    console.log('Evidence response received');
                                    var currIndex = i;
                                    this.deleteFile(this.messageQueue[i].payload.photoRef, currIndex, function (err, index) {
                                        if (err)
                                            console.log(err);
                                        else {
                                            window.cti.store.messageQueue.splice(index, 1);
                                            window.commsManager.updateQueue(window.cti.store.messageQueue);
                                            if (window.cti.store.messageQueue.length > 0) {
                                                window.commsManager.processQueue();
                                            }
                                        }
                                    });
                                }
                                else {
                                    if (this.messageQueue[i].endpoint === 'saveDwb') {
                                        var dwbs = window.cti.store.sentDwbs;
                                        for (var j = 0; j < dwbs.length; j++) {
                                            if (dwbs[j].commsManagerId === this.messageQueue[i].payload.commsManagerId)
                                                dwbs[j].serverResponseReceived = true;
                                        }
                                    }
                                    this.messageQueue.splice(i, 1);
                                    this.updateQueue(this.messageQueue);
                                    if (this.messageQueue.length > 0)
                                        this.processQueue();
                                }
                            }
                        }
                    }
                }
                if (window.localStorage['reconciling'] == "true") {
                    var completedReconciling = this.checkIfReconcileIsComplete();
                    if (completedReconciling) {
                        delete window.localStorage['reconciling'];
                        if (loader !== undefined)
                            loader.hide();
                    }
                }
                else {
                    if (loader !== undefined)
                        loader.hide();
                }
            }
        }
    };
    CommsManager.prototype.processInboxChange = function (err, message) {
    };
    CommsManager.prototype.checkIfReconcileIsComplete = function () {
        var remainingMsgs = true;
        var dwbs = window.cti.store.sentDwbs;
        for (var j = 0; j < dwbs.length; j++) {
            if (dwbs[j].serverResponseReceived !== true) {
                remainingMsgs = false;
                break;
            }
        }
        return remainingMsgs;
    };
    CommsManager.prototype.deleteFile = function (filePath, currIndex, callback) {
        var myFolderApp = 'my_folder';
        function fileSystemError(err) {
            console.log(err);
            callback(err);
        }
        window.resolveLocalFileSystemURL(filePath, function (entry) {
            entry.remove(function () {
                console.log('File deleted: %s', filePath);
                callback(false, currIndex);
            }, fileSystemError);
        }, fileSystemError);
    };
    CommsManager.prototype.generateUUID = function () {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now();
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };
    return CommsManager;
}());
function initialiseCommsManager() {
    window.commsManager = new CommsManager();
}
document.removeEventListener('deviceready', initialiseCommsManager);
document.addEventListener('deviceready', initialiseCommsManager);
