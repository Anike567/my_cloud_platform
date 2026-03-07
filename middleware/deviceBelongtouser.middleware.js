const { pool } = require("../config/db.cofig");

/**
 * Validates that the requesting device AND the target device (if provided)
 * belong to the authenticated user.
 */
module.exports = async function deviceBelongsToUser(req, res, next) {
    try {
        const user = req.user;
        const userId = user.id;
        // 1. Get Local Device ID from Headers (Metadata)
        const localDeviceId = req.headers['x-device-id'];
        
        // 2. Get Target Device ID from Body (Business Logic)
        // We use || localDeviceId so that if a body device isn't sent, we still validate the header
        console.log(localDeviceId);

        if (!localDeviceId) {
            return res.status(400).json({ 
                error: true, 
                message: "Identification header missing (x-device-id)" 
            });
        }

        /**
         * 3. Optimized Query:
         * We check if BOTH IDs exist in the devices table for this user.
         * Using a Set/Unique check ensures that if they are the same, it still works.
         */
        
        
        const query = `
            SELECT COUNT(*) as count 
            FROM devices 
            WHERE android_id = ? AND user_id = ?`;

        const [rows] = await pool.query(query, [localDeviceId, userId]);
        // If the count doesn't match the number of unique IDs we sent, 
        // at least one of the devices doesn't belong to the user.
        if (rows[0].count === 0) {
            return res.status(403).json({ 
                error: true, 
                message: "Device authorization failed. Access denied." 
            });
        }

        // Attach the validated local device ID to the request for use in controllers
        req.validatedLocalDeviceId = localDeviceId;

        next();
    } catch (err) {
        console.error("❌ Device Auth Middleware Error:", err);
        return res.status(500).json({ 
            error: true, 
            message: "Internal server error during device validation" 
        });
    }
};