const path = require('path');
const { v7: uuidv7 } = require('uuid');
const fs = require('fs');
const IMAGE_DIR = path.join(__dirname, '../../uploads/images');
const EventEmitter = require('events');

module.exports = class fetchImagesService {
    constructor() {
        this.myEmitter = new EventEmitter();
        this.myEmitter.setMaxListeners(100); 
    }

    async getImages(req, res) {
        const { fcmToken, deviceId } = req.body;
        const requestId = uuidv7(); // This will be our unique bridge ID

        // 1. Define the callback that will respond to the HTTP request
        const handleCallback = (payload) => {
            clearTimeout(timeOut);
            this.myEmitter.removeListener(requestId, handleCallback);
            
            // Send the data received from the phone back to the original caller
            if (!res.headersSent) {
                res.status(200).json({ success: true, data: payload });
            }
        };

        // 2. Register the listener BEFORE sending the notification
        this.myEmitter.once(requestId, handleCallback);

        // 3. Set a safety timeout
        const timeOut = setTimeout(() => {
            this.myEmitter.removeListener(requestId, handleCallback);
            if (!res.headersSent) {
                res.status(408).json({ 
                    error: true, 
                    message: "Phone is not responding within 30 seconds" 
                });
            }
        }, 30000);

        try {
            /** * ✅ TODO: Send FCM Notification here
             * You must include 'requestId' in your FCM data payload.
             * The phone will receive it, find the file, and call your /callback route.
             */
            console.log(`[FetchService] Request ${requestId} sent to device ${deviceId}`);
            
            // We do NOT call res.send() here. The request stays "Hanging" 
            // until handleCallback is triggered or timeout hits.
            
        } catch (err) {
            clearTimeout(timeOut);
            this.myEmitter.removeListener(requestId, handleCallback);
            res.status(500).json({ error: "Failed to initiate device request" });
        }
    }

    // This route is called by the Mobile Phone (The "Answer")
    async callback(req, res) {
        const { requestId, payload } = req.body; // Ensure phone sends 'requestId'

        if (!requestId) {
            return res.status(400).json({ error: "Missing requestId" });
        }

        // 4. Emit the event to wake up the getImages function waiting above
        const hasListeners = this.myEmitter.emit(requestId, payload);

        if (hasListeners) {
            res.status(200).json({ error: false, message: "Data forwarded to requester" });
        } else {
            // This happens if the user cancelled or the 30s timeout already passed
            res.status(410).json({ error: true, message: "Request expired or listener closed" });
        }
    }
};