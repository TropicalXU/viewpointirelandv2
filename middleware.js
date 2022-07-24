const {locationSchema, reviewSchema} = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Location = require('./models/Location');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res ,next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next()
}

//VALIDATE LOCATION BODY IS CORRECT WHEN EDITING/UPDATING
module.exports.validateLocation = (req, res, next) => {
   
    const {error} = locationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else {
        next();
    }
       
}

//CHECK IF AUTHOR MIDDLEWARE
module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const location = await Location.findById(id);
    if(!location.author.equals(req.user._id)){//IF CURRENT USER DOES NOT OWN THIS LOCATION(ID)
req.flash('error', 'You do not have permission to do that!');
return res.redirect(`/locations/${id}`); // REDIRECT TO LOCATION ID SHOW PAGE
    }  
    next()
}

//CHECKING FOR AUTHOR OF REVIEWS
module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){//IF CURRENT USER DOES NOT OWN THIS CAMPGROUND(ID)
req.flash('error', 'You do not have permission to do that!');
return res.redirect(`/locations/${id}`); // REDIRECT TO CAMPGROUND ID SHOW PAGE
    }  
    next()
}

//VALIDATING REVIEWS
module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else {
        next();
    }
}