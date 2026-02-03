const crypto = require('crypto');
const fs = require('fs');
const os = require('os'); // Added for cross-platform NewLine support

/**
 * This script generates a new 256-bit symmetric key for encryption.
 * It automatically appends it to your .env file if not already present.
 */
function generateSymmetricKey() {
    const KEY_NAME = 'SYMMETRIC_KEY';
    const ENV_PATH = '.env';

    // 1. Check if the key already exists to avoid duplicates
    if (fs.existsSync(ENV_PATH)) {
        const content = fs.readFileSync(ENV_PATH, 'utf8');
        if (content.includes(`${KEY_NAME}=`)) {
            console.log(`[Info] ${KEY_NAME} already exists in .env. Skipping generation.`);
            return;
        }
    } else {
        // Create the file if it doesn't exist
        fs.writeFileSync(ENV_PATH, '');
        console.log(`[Info] Created new ${ENV_PATH} file.`);
    }

    // 2. Generate a secure 32-byte (256-bit) key
    const newKey = crypto.randomBytes(32).toString('hex');

    // 3. Append with proper spacing and OS-specific newlines
    // We use os.EOL to handle \n (Linux/Mac) vs \r\n (Windows) correctly
    const entry = `${os.EOL}${KEY_NAME}=${newKey}${os.EOL}`;
    
    try {
        fs.appendFileSync(ENV_PATH, entry, 'utf8');
        console.log("-----------------------");
        console.log("New Symmetric Key Generated!");
        console.log(`Key: ${newKey}`);
        console.log(`Status: Successfully saved to ${ENV_PATH}`);
        console.log("-----------------------");
    } catch (err) {
        console.error("[Error] Failed to write to .env file:", err.message);
    }
}

// Call it directly if running the script
// if (require.main === module) {
//     generateSymmetricKey();
// }

module.exports = generateSymmetricKey;