const upload = require('../../config/multer.config');
const { pool } = require('./../../config/db.cofig');
const validateKeys = require('./../../scripts/validateKeys');
class UploadService {
    constructor() { }
    async getImage(req, res) {
       
    }      
    async getAllImages(req, res){
        const {deviceId} = req.body;
        try {
            const [rows] = await pool.query(
                "SELECT image_location FROM images WHERE device_id = ?",
                [deviceId]
            );
            const imageLocations = rows.map(row => row.image_location);
            res.json({ images: imageLocations });
        } catch (err) {
            console.error("❌ Fetch Error:", err);
            res.status(500).json({
                error: "Failed to fetch images",
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
            const {deviceId, checksum, imageLocation} = req.body;
            console.log(req.body);
            const requiredKeys = ["deviceId", "checksum", "imageLocation"];
            if(!validateKeys(requiredKeys, req.body)){
                return res.status(400).json({error : true, message : "Some fiels are missing"});
            }
            // console.log(deviceId, fileHash, fileLocation);

            const insertQuery = `
  INSERT INTO images (device_id, checksum, image_location, created_at)
  VALUES (?, ?, ?, NOW())
`;

            await pool.query(insertQuery, [
                deviceId,
                checksum,
                imageLocation,
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