const router = require('express').Router();
const { Router } = require('express');
const authenticate = require('./../../middleware/auth.middleware')
const fetchImagesService = require("./../../services/fetch/fetchImages.service");

const fetchImages = new fetchImagesService();

const fetchImageController = Router();

/**
 * 1. GET LIST OF IMAGES (Protected)
 * Returns: ["img1.jpg", "img2.png"]
 */
fetchImageController.get("/images", (req, res)=>{
    fetchImages.getImages(req, res);
});

fetchImageController.post("/callback", (req, res)=>{
    console.log("request get hit");
    fetchImages.callback(req, res);
})


    
module.exports = fetchImageController;