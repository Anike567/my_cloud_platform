
const { pool } = require("../../config/db.cofig");

class DeviceSyncServices {
    constructor() { }

    async syncDevice(req, res) {
        try {
            const { androidId, userId, fcmToken } = req.body;
            console.log(androidId, userId);
            // Validation
            if (!androidId || !userId) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Missing required fields: androidId or userId" 
                });
            }

            const query = `
                INSERT INTO devices (android_id, fcm_token, user_id) 
                VALUES (?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                    fcm_token = VALUES(fcm_token), 
                    user_id = VALUES(user_id),
                    last_sync = CURRENT_TIMESTAMP;
            `;

            const [result] = await pool.execute(query, [androidId, fcmToken || null, userId]);

            console.log(`📱 Device Synced: ID ${androidId} for User ${userId}`);

            return res.status(200).json({
                success: true,
                message: "Device synchronized successfully",
                details: {
                    isNewDevice: result.affectedRows === 1,
                    isUpdated: result.affectedRows === 2 
                }
            });

        } catch (error) {
            console.error("❌ Error in syncDevice Service:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error during device synchronization",
                error: error.message
            });
        }
    }
}

// Exporting an instance of the class
const deviceSyncServices = new DeviceSyncServices();
module.exports = deviceSyncServices;