const Location = require('../models/Location');
const Review = require('../models/review');

//CREATE REVIEW 
module.exports.createReview = async(req, res) => {
    const location = await Location.findById(req.params.id);
    const review = new Review(req.body.review);
     review.author = req.user._id;
    location.reviews.push(review);
    await review.save();
    await location.save();
    req.flash('success', 'Successfully created a new review!');
    res.redirect(`/locations/${location._id}`);
}

//DELETE REVIEW
module.exports.deleteReview = async(req, res) => {
    const  {id, reviewId} = req.params;
    await Location.findByIdAndUpdate(id, {$pull: {reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/locations/${id}`);
}