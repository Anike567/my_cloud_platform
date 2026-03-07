const upload = require('../../config/multer.config');
const { pool } = require('./../../config/db.cofig');
const validateKeys = require('./../../scripts/validateKeys');
class UploadService {
    constructor() { }
    async getImage(req, res) {

    }
    async getAllImages(req, res) {
        const { lastId = 0 } = req.body;
        const limit = 50;
        const user = req.user;

        try {
            // 1. Get all device IDs associated with this user
            const [deviceRows] = await pool.query(
                "SELECT android_id FROM devices WHERE user_id = ?",
                [user.id]
            );

            // 2. Safety check: If user has no devices, return empty images immediately
            if (deviceRows.length === 0) {
                return res.status(200).json({
                    error: false,
                    images: [],
                    nextId: lastId,
                    hasMore: false
                });
            }

            // 3. Extract IDs into a simple array: ["id1", "id2"]
            const androidIds = deviceRows.map(device => device.android_id);
            console.log(androidIds);
            /**
             * 4. ✅ SQL FIX: 
             * In mysql2, for the 'IN' operator to work with an array, 
             * you must wrap the array in another array: [[ids]]
             */
            const [rows] = await pool.query(
                "SELECT id, image_location, preview, device_id FROM images  WHERE device_id IN (?) AND id > ? ORDER BY id ASC LIMIT ?",
                [androidIds, lastId, limit]
            );

            const nextId = rows.length > 0 ? rows[rows.length - 1].id : lastId;
            const hasMore = rows.length === limit;
            console.log(rows.length);
            return res.status(200).json({
                error: false,
                images: rows,
                nextId: nextId,
                hasMore: hasMore
            });

        } catch (err) {
            console.error("❌ SQL Fetch Error:", err);
            return res.status(500).json({
                error: true,
                message: "Failed to fetch images",
                detail: err.message
            });
        }
    }

    async syncUpload(req, res) {
        try {
            const { images, deviceId } = req.body;

            if (!images || !Array.isArray(images) || images.length === 0) {
                return res.json({ missingImages: [], message: "No images provided" });
            }

            const virtualTableQuery = images.map(() => "SELECT ? AS hash").join(" UNION ALL ");

            const query = `
            SELECT t.hash 
            FROM (${virtualTableQuery}) AS t
            LEFT JOIN images i ON t.hash = i.checksum AND i.device_id = ?
            WHERE i.checksum IS NULL
        `;
            const queryParams = [...images, deviceId];

            const [rows] = await pool.query(query, queryParams);

            const missingImages = rows.map(row => row.hash);
            // console.log(missingImages);

            res.json({
                message: missingImages.length > 0 ? "Sync required" : "All clear",
                missingImages
            });

        } catch (err) {
            console.error("❌ Sync Error:", err);
            res.status(500).json({
                error: "Sync failed",
                detail: err.message
            });
        }
    }

    async uploadImage(req, res) {
        try {
            const { deviceId, checksum, imageLocation, preview } = req.body;
            const requiredKeys = ["deviceId", "checksum", "imageLocation"];
            if (!validateKeys(requiredKeys, req.body)) {
                return res.status(400).json({ error: true, message: "Some fiels are missing" });
            }
            // console.log(deviceId, fileHash, fileLocation);

            const insertQuery = `
  INSERT INTO images (device_id, checksum, image_location, preview, created_at)
  VALUES (?, ?, ?, ?, NOW())
`;

            await pool.query(insertQuery, [
                deviceId,
                checksum,
                imageLocation,
                preview
            ]);

            return res.json({
                success: true,
                message: "Image uploaded successfully",
            });

        } catch (err) {
            console.error("❌ Upload Error:", err);

            return res.status(500).json({
                success: false,
                message: "Upload failed",
                error: err.message,
            });
        }
    }


}

module.exports = UploadService;