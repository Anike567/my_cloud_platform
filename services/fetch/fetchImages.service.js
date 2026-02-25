const path = require('path');
const { v7: uuidv7 } = require('uuid');
const fs = require('fs');
const IMAGE_DIR = path.join(__dirname, '../../uploads/images');
const EventEmitter = require('events');
const sendNotification = require('./../../scripts/sendNotification');
module.exports = class fetchImagesService {
    

    async getImages(req, res) {
        const reqId = uuidv7();
        const {success, messageId} = await sendNotification(reqId);
        if(success){
            return res.status(200).json({message : "Notification sent successfully"});
        }
        
        res.status(500).json({message : "Internal server error occures"});
    }

    // This route is called by the Mobile Phone (The "Answer")
    async callback(req, res) {
       
        console.log(req.body);
        res.status(200).json({message : "done"});
    }
};