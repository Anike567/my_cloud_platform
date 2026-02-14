const express = require('express');
const authenticate = require('./../../middleware/auth.middleware');
const uploadService = require('./../../services/upload/upload.Service');

const uploadController = express.Router();
const uploadServiceInstance = new uploadService();
uploadController.post("/sync",(req, res)=>{
    
    uploadServiceInstance.syncUpload(req, res);
});

/**
 * 1. GET LIST OF IMAGES (Protected)
 * Returns: ["img1.jpg", "img2.png"]
 */
// uploadController.get("/images", authenticate, (req, res)=>{
//     // uploadService.getImages(req, res);
// });;

/**
 * 2. GET SINGLE IMAGE (Protected)
 * Usage: /images/my-secret-photo.jpg
 */
// uploadController.get("/images/:filename", authenticate, (req, res)=>{
//     // uploadService.getImage(req, res);
// });
    


module.exports = uploadController;