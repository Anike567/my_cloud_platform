const validateKey = require("../../scripts/validateKeys");
const RedisConfiguration = require('./../../config/redis.config');

class UploadStreamServices {
    async uploadStream(req, res) {
        // We still expect these fields from your updated frontend
        const required = ["reqId", "chunk", "isFinal"];

        if (!validateKey(required, req.body)) {
            return res.status(400).json({ error: true, message: "Required fields (reqId, chunk, isFinal) are missing" });
        }

        const { reqId, chunk, isFinal } = req.body;

        try {
            const client = RedisConfiguration.getClient();

            /**
             * 1. ✅ Use SET instead of APPEND for single-payload uploads.
             * Since the frontend now sends the full image in one 'chunk', 
             * SET ensures we don't duplicate data if the background task retries.
             */
            await client.set(reqId, chunk);

            if (isFinal) {
                /**
                 * 2. ✅ Expiry Management
                 * Set expiry to 10 minutes (600 seconds). 
                 * This gives the user enough time to view the modal before Redis clears it.
                 */
                await client.expire(reqId, 600);
                
                console.log(`✅ Image ${reqId} is now ready for retrieval in Redis.`);
            }

            return res.status(200).json({
                error: false,
                message: "Image stored successfully in cache"
            });
        } catch (err) {
            console.error("❌ Redis Error:", err);
            return res.status(500).json({ error: true, message: "Internal server error" });
        }
    }
}

module.exports = UploadStreamServices;
