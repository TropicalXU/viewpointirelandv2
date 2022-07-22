const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const locations = require('../contollers/locations');
const multer  = require('multer');
const {storage} = require('../cloudinary');
const { Router } = require('express');
const upload = multer({ storage });

router.route('/')
 .get(catchAsync(locations.index))//SHOWING CAMPGROUND PAGE - controllers/campgrounds/index
 .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(locations.createCampground));//using multer/upload(middleware) for image upload use .single for 1/or .array for multiple
// .post(isLoggedIn, validateCampground, upload.array('image'), catchAsync(campgrounds.createCampground));
 
 //CAMPGROUND NEW PAGE- SHOWING ONLY FOR USER THAT IS LOGGED IN - controllers/campgrounds/renderNewForm
router.get('/new', isLoggedIn, locations.renderNewForm);

router.route('/:id')
.get(catchAsync(locations.showCampground))//SHOW CAMPGROUND TEMPLATe - controllers/campgrounds/showCampground
.put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(locations.updateCampground))//UPDATE CAMPGROUND - controllers/campgrounds/updateCampground
.delete(isLoggedIn, isAuthor, catchAsync(locations.deleteCamprground));//DELETE CAMPGROUND - controllers/campgrounds/deleteCampground

//EDIT CAMPGROUND - controllers/campgrounds/renderEditForm
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(locations.renderEditForm));

module.exports = router;