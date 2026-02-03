const express = require('express');
const authenticate = require('./../../middleware/auth.middleware');

const uploadServices = require('../../services/upload/upload.service');

const uploadService= new uploadServices();

const uploadController = express.Router();



/**
 * 1. GET LIST OF IMAGES (Protected)
 * Returns: ["img1.jpg", "img2.png"]
 */
uploadController.get("/images", authenticate, (req, res)=>{
    uploadService.getImages(req, res);
});;

/**
 * 2. GET SINGLE IMAGE (Protected)
 * Usage: /images/my-secret-photo.jpg
 */
uploadController.get("/images/:filename", authenticate, (req, res)=>{
    uploadService.getImage(req, res);
});
    


module.exports = uploadController;