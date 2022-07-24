const express = require('express');

//MERGING PARAMS SO THAT HAS ACCESS TO ALL PARAMS FROM LINE 37 APP.JS
const router = express.Router({ mergeParams: true});
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const Location = require('../models/Location');
const Review = require('../models/review');
const reviews = require('../contollers/reviews')
const catchAsync = require('../utils/catchAsync');


//CREATE REVIEW - controllers/reviews/createReview
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

//DELETE REVIEW - controllers/reviews/deleteReview
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;

    