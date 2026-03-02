const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const SYMMETRIC_KEY = process.env.SYMMETRIC_KEY; 
const SECRET = process.env.SECRET;
const EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || '1h';

const generateToken = (payload) => {
    // 1. Create the standard JWT
    const jwtToken = jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });

    // 2. Setup Encryption
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(12); // 12 bytes is standard for GCM
    const key = Buffer.from(SYMMETRIC_KEY, 'hex');

    // 3. Encrypt the JWT string
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(jwtToken, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // 4. Get the Auth Tag (must be done after cipher.final())
    const authTag = cipher.getAuthTag().toString('hex');

    // 5. Return the "Double-Locked" token
    // Format: iv.authTag.encryptedData
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

module.exports = generateToken;