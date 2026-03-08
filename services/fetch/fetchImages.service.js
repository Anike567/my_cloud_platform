const path = require('path');
const { v7: uuidv7 } = require('uuid');
const fs = require('fs');
const IMAGE_DIR = path.join(__dirname, '../../uploads/images');
const sendNotification = require('./../../scripts/sendNotification');
const RedisConfiguration = require('./../../config/redis.config');
const validateKey = require('./../../scripts/validateKeys');
const { pool } = require('./../../config/db.cofig');
module.exports = class fetchImagesService {


    async getImages(req, res) {

        const requiredKeys = ["deviceId", "fileLocation"];
        console.log(req.body);
        if (!validateKey(requiredKeys, req.body)) {
            return res.status(400).json({ error: true, message: "Some required fields are missing" })
        }
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }
        const { id, deviceId, fileLocation } = req.body;
        const reqId = id;
        try {
            const imageALreadyExists = await RedisConfiguration.getClient().exists(reqId);
            if (imageALreadyExists) {
                return res.status(200).json({
                    success: true,
                    message: "Sync request sent to device",
                    requestId: reqId
                });
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ error: true, message: "Internal server error" });
        }
        try {
            const getFcmTokenQuery = `SELECT devices.fcm_token 
FROM users 
INNER JOIN devices ON users._id = devices.user_id 
WHERE users._id = ? AND devices.android_id = ?;`;

            const [rows] = await pool.execute(getFcmTokenQuery, [user.id, deviceId]);

            if (rows.length === 0 || !rows[0].fcm_token) {
                return res.status(404).json({ error: true, message: "Device not found or FCM token missing" });
            }

            const targetFcmToken = rows[0].fcm_token;
            console.log("🚀 Sending notification to token:", targetFcmToken);


            const { success, messageId } = await sendNotification(reqId.toString(), fileLocation, targetFcmToken);

            if (success) {
                return res.status(200).json({
                    success: true,
                    message: "Sync request sent to device",
                    requestId: reqId
                });
            } else {
                return res.status(500).json({ error: true, message: "Failed to send notification" });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal server error occures" });
        }

    }

    async callback(req, res) {
        const { reqId } = req.body;
        const client = RedisConfiguration.getClient();
        console.log("from callback", reqId);
        try {
            const imageStream = await client.get(reqId);

            if (imageStream) {
                return res.status(200).json({ error: false, status: "completed", data: imageStream });
            }
            return res.status(200).json({ error: false, status: "pending", message: "Image not found" });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ error: true, message: "internal server error" });
        }
    }
};