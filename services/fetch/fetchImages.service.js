const path = require('path');
const { v7: uuidv7 } = require('uuid');
const fs = require('fs');
const IMAGE_DIR = path.join(__dirname, '../../uploads/images');
const EventEmitter = require('events');
const sendNotification = require('./../../scripts/sendNotification');
module.exports = class fetchImagesService {
    

    async getImages(req, res) {
        const {success, messageId} = await sendNotification();
        if(success){
            return res.status(200).json({message : "Notification sent successfully"});
        }
        
        res.status(500).json({message : "Internal server error occures"});
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