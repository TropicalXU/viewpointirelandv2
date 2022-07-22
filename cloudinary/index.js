const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({//ASSOSCIATING ARE ACCOUNT WITH THIS CLOUDINARY INSTANCE
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
//SETTING UP AN INSTANCE OF CLOUDINARY STORAGE IN THIS FILE
const storage = new CloudinaryStorage({
    cloudinary,//pass in cloudinary object
    params: {
        folder: 'YelpCamp',//specify folder/which is folder in cloudinary that we can store things in
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}