const path = require('path');
const fs = require('fs');
const IMAGE_DIR = path.join(__dirname, '../../uploads/images');

class uploadServices {
    constructor() {
    }

    async getImages(req, res) {
        try {
            const files = await fs.promises.readdir(IMAGE_DIR);
            const images = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
            res.json({ images });
        } catch (err) {
            res.status(500).json({ error: "Access denied or folder missing" });
        }
    }

    getImage(req, res) {
        const fileName = req.params.filename;

        // SECURITY: Prevent Directory Traversal (e.g., ../../../etc/passwd)
        const safeFilePath = path.join(IMAGE_DIR, path.basename(fileName));

        if (!fs.existsSync(safeFilePath)) {
            return res.status(404).json({ error: "Image not found" });
        }

        // Serve the file securely
        res.sendFile(safeFilePath);
    }
}

module.exports = uploadServices;