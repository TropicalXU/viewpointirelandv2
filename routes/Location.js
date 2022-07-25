const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const { isLoggedIn, validateLocation, isAuthor } = require('../middleware');
const locations = require('../contollers/locations');
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

const Location = require('../models/Location');

router.route('/')
 .get(catchAsync(locations.index))//SHOWING LOCATION PAGE - controllers/locations/index
 .post(isLoggedIn, upload.array('image'), validateLocation, catchAsync(locations.createLocation));//using multer/upload(middleware) for image upload use .single for 1/or .array for multiple
// .post(isLoggedIn, validateLocation, upload.array('image'), catchAsync(locations.createLocation));
 
 //LOCATION NEW PAGE- SHOWING ONLY FOR USER THAT IS LOGGED IN - controllers/locations/renderNewForm
router.get('/new', isLoggedIn, locations.renderNewForm);

router.route('/:id')
.get(catchAsync(locations.showLocation))//SHOW LOCATION TEMPLATE - controllers/locations/showLocation
.put(isLoggedIn, isAuthor, upload.array('image'), validateLocation, catchAsync(locations.updateLocation))//UPDATE LOCATION - controllers/locations/updateLocation
.delete(isLoggedIn, isAuthor, catchAsync(locations.deleteLocation));//DELETE LOCATION - controllers/locations/deleteLocation

//EDIT LOCATION - controllers/locations/renderEditForm
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(locations.renderEditForm));

module.exports = router;