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
        const authHeader = req.headers['Authorization'] || req.headers['authorization'];
        const encryptedToken = authHeader && authHeader.split(' ')[1];
        if (!encryptedToken) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        
        // Split the encrypted token into its components
        const parts = encryptedToken.split('.');
        if (parts.length !== 3) {
            return res.status(401).json({ error: "Invalid token format" });
        }
        
        const [ivHex, authTagHex, encryptedData] = parts;

        // Setup decryption
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const key = Buffer.from(SYMMETRIC_KEY, 'hex');
        const algorithm = 'aes-256-gcm';

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        decipher.setAuthTag(authTag);

        // Decrypt the data
        let decrypted;
        try {
            decrypted = decipher.update(encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
        } catch (error) {
            console.log(error);
            return res.status(401).json({ error: "Unauthorized" });
        }

        console.log(decrypted) ;
        const decoded = jwt.verify(decrypted, SECRET);
        console.log(decoded);
        req.user = decoded;
        next();

    } catch (error) {
        // Catches expired tokens or invalid JWT signatures
        return res.status(401).json({ error: "Unauthorized" });
    }
}

module.exports = authenticate;