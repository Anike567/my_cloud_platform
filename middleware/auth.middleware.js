/**
 * * Middleware to authenticate requests.
* how does it work : first decreypt the token using the symmetric key stored in env variables
* then verify the jwt using the secret stored in env variables
* if both are valid allow the request to proceed else return 401 unauthorized
*
 */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const SYMMETRIC_KEY = process.env.SYMMETRIC_KEY; 
const SECRET = process.env.SECRET;

function authenticate(req, res, next) {
    try {
        const authHeader = req.headers['authorization']; // Standardized to lowercase
        const tokenFromHeader = authHeader && authHeader.split(' ')[1];
        if (!tokenFromHeader) return res.status(401).json({ error: "Unauthorized" });

        // ✅ 1. Use a colon instead of a dot to avoid JWT character conflicts
        const parts = tokenFromHeader.split(':'); 
        if (parts.length !== 3) {
            return res.status(401).json({ error: "Invalid token format" });
        }

        const [ivHex, authTagHex, encryptedData] = parts;

        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const key = Buffer.from(SYMMETRIC_KEY, 'hex'); // ✅ Must be 32 bytes

        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);

        let decrypted;
        try {
            decrypted = decipher.update(encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
        } catch (error) {
            // Usually fails if SYMMETRIC_KEY or AuthTag is wrong
            console.error("Decryption Failed:", error.message);
            return res.status(401).json({ error: "Decryption Failed" });
        }

        // ✅ 2. Verify the inner JWT
        jwt.verify(decrypted, SECRET, (err, decoded) => {
            if (err) return res.status(401).json({ error: "Invalid JWT" });
            req.user = decoded;
            next();
        });

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ error: "Unauthorized" });
    }
}
module.exports = authenticate;