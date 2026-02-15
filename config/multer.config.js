const multer = require('multer');
const fs = require('fs');
const path = require('path');

const destinationMap = {
  image: 'uploads/images',
};

/** Ensure folder exists */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = file.mimetype.split('/')[0];
    const destinationPath = destinationMap[type] || 'uploads/others';

    ensureDir(destinationPath); // ✅ important fix
    cb(null, destinationPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);

    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

/** Optional but recommended security */
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
});


module.exports = upload;