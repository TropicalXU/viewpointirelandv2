
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String

});

ImageSchema.virtual('thumbnail').get(function() {//make virtual property to access .thumbnail
    return this.url.replace('/upload', '/upload/w_500');
});//creating a thumbnail image//can now call img.thumbnail in show/edit page

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true

        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    // price: Number,
    description: String,
    location: String,
    author: {//DEFINING AN AUTHOR FOR FEATURES - ADD CAMPRGROUND/REVIEWS
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
   

},opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {//make virtual property to access .thumbnail
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
});



//DELETING ASSOCIATED REVIEWS AFTER DELETING CAMPGROUND , QUERY MIDDLEWARE

CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

//EXPORTING CAMPGROUND MODEL

module.exports = mongoose.model('Campground', CampgroundSchema);



