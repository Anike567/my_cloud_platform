const { pool } = require("../config/db.cofig");

/**
 * check that user is accessing its own device not other
 * @param {deviceId:string} req 
 * @param {} res 
 * @param {*} next 
 * @returns 
 */
module.exports = async function deviceBelongtoUser(req, res, next) {
    try {
        const user = req.user;
        const userId = user.id;
        const { deviceId } = req.body;

  
        const query = `
            SELECT EXISTS(
                SELECT 1 FROM devices WHERE android_id = ? AND user_id = ?
            ) AS is_owner`;

        
        const [rows] = await pool.execute(query, [deviceId, userId]);
        
        
        const result = rows[0];

  
        if (!result || !result.is_owner) {
            return res.status(401).json({ 
                error: true, 
                message: "You are not authorized for this operation" 
            });
        }

        next();
    } catch (err) {
        console.error("Device Auth Error:", err);
        return res.status(500).json({ 
            error: true, 
            message: "Internal server error occurred" 
        });
    }
}