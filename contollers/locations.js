const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const { cloudinary } = require('../cloudinary/index');

//SHOWING CAMPGROUND PAGE 
module.exports.index = async (req,res) => {
    const locations = await Campground.find({});
    res.render('locations/index', {locations})
}

//CAMPGROUND NEW PAGE
module.exports.renderNewForm = (req, res) => {
    res.render('locations/new');
}

//CREATE A NEW CAMPGROUND
module.exports.createCampground = async(req,res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
   const campground = new Campground(req.body.campground);
   campground.geometry = geoData.body.features[0].geometry;//models/campground.js line 19-- grabbing geodata from boding and parsing the json
   campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));//mapp over array thats been added to req.files thanks to multer/take path/filename make new object for each
   campground.author = req.user._id; //DEFINING WHICH USER IS ON THE PAGE IF THEY ADD CAMPGROUND THEIR NAME WILL SHOW
   await campground.save();
   console.log(campground.images);
   req.flash('success', 'Successfully made a new location!');
   res.redirect(`/locations/${campground._id}`)
   next();
       
}

//SHOW CAMPGROUND
module.exports.showCampground = async (req,res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }//POPULATING AUTHOR OF EACH REVIEW
    }).populate('author');
    if(!campground){
        req.flash('error', 'Location does not exist!');
        return res.redirect('/locations');
    }
    res.render('locations/show', {campground});
}

//EDIT CAMPGROUND
module.exports.renderEditForm = async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'Location does not exist!');
        return res.redirect('/locations');
    }
    res.render('locations/edit', {campground});
}

//UPDATE CAMPGROUND
module.exports.updateCampground = async(req,res) => {
    const {id} = req.params;//FIND CAPMGROUND ID
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save()
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages ){//for each filename call-
            await cloudinary.uploader.destroy(filename);//removing images from cloudinary when deleted


        }
       await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}} }) //$pull - to pull elements out of an array
    }//deleting specific images from campground
   
    req.flash('success', 'Successfully updated location!')
    res.redirect(`/locations/${campground._id}`)
}

//DELETE CAMPGROUND
module.exports.deleteCamprground = async(req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted location!')
    res.redirect('/locations');
 }