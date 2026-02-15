const express = require('express');
const authenticate = require('./../../middleware/auth.middleware');
const uploadService = require('./../../services/upload/upload.Service');
const upload = require('./../../config/multer.config');

const uploadController = express.Router();
const uploadServiceInstance = new uploadService();

uploadController.get("/images", authenticate, (req, res) => {
    uploadServiceInstance.getAllImages(req, res);
});

uploadController.post("/sync", authenticate, (req, res) => {

    uploadServiceInstance.syncUpload(req, res);
});




uploadController.post(
    "/upload",
    authenticate,
    upload.single("image"),
    (req, res) => {
        console.log("Received upload request");
        uploadServiceInstance.uploadImage(req, res);
    }
);



module.exports = uploadController;