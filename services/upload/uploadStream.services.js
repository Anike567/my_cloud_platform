const validateKey = require("../../scripts/validateKeys");
const RedisConfiguration = require('./../../config/redis.config');

class UploadStreamServices {
    async uploadStream(req, res) {
        const required = ["reqId", "chunk", "isFinal"];

        // 1. Fixed the validation logic syntax
        if (!validateKey(required, req.body)) {
            return res.status(400).json({ error: true, message: "Some fields are missing" });
        }

        const { reqId, chunk, isFinal } = req.body;

        try {
            const client = RedisConfiguration.getClient();

            /**
             * 2. ✅ Performance Fix: Use APPEND instead of GET + SET
             * This happens inside Redis (C++ level), so Node.js doesn't have to 
             * hold the entire growing file in its memory.
             */
            await client.append(reqId, chunk);

            if (isFinal) {
                // 3. Set an expiry (e.g., 1 hour) so Redis doesn't fill up forever
                await client.expire(reqId, 3600);
                
                // Here you would typically trigger a "Save to Disk/DB" job
                console.log(`File ${reqId} is complete in Redis.`);
            }

            return res.status(200).json({
                error: false,
                message: isFinal ? "Image received completely" : "Chunk processed"
            });
        } catch (err) {
            console.error("Redis Error:", err);
            return res.status(500).json({ error: true, message: "Internal server error" });
        }
    }
}

module.exports = UploadStreamServices;