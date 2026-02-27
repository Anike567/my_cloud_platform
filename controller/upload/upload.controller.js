const express = require('express');
const authenticate = require('./../../middleware/auth.middleware');
const uploadService = require('./../../services/upload/upload.Service');
const upload = require('./../../config/multer.config');
const UploadStreamServices = require('./../../services/upload/uploadStream.services');
const uploadController = express.Router();
const uploadServiceInstance = new uploadService();
const uploadStreamServices = new UploadStreamServices();

uploadController.post("/images", authenticate, (req, res) => {
    uploadServiceInstance.getAllImages(req, res);
});

uploadController.post("/sync", authenticate, (req, res) => {

    uploadServiceInstance.syncUpload(req, res);
});




uploadController.post(
    "/upload",
    authenticate,
    (req, res) => {
        console.log("Received upload request");
        uploadServiceInstance.uploadImage(req, res);
    }
);

uploadController.post("/upload-stream", authenticate, (req, res)=>{
    uploadStreamServices.uploadStream(req, res);
})



module.exports = uploadController;