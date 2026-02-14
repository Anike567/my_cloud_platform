class UploadService {
    constructor() {}

    syncUpload(req, res){
        const {images} = req.body;
        console.log(`Received ${images[0]}`);
        return res.status(200).json({ message: "Images synced successfully", imagesNeedToBeUploaded: images.length });
    }
}

module.exports = UploadService;