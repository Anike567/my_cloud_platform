const router = require('express').Router();
const { Router } = require('express');
const authenticate = require('./../../middleware/auth.middleware')
const fetchImagesService = require("./../../services/fetch/fetchImages.service");

const fetchImages = new fetchImagesService();

const fetchImageController = Router();

/**
 * fetch the fcm token from fcm id with respectice devideId
 * generate a uuid request to uniquely identify this rquest
 * send notification to the specifice id  with image location which is required
 * 
 */
fetchImageController.get("/images", authenticate, (req, res)=>{
    fetchImages.getImages(req, res);
});
/**
 * call back function for checking for saving image into redis as a buffer with the respective requestid
 */
fetchImageController.post("/callback", authenticate,(req, res)=>{
    fetchImages.callback(req, res);
})


    
module.exports = fetchImageController;