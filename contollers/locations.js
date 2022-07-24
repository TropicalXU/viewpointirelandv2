const Location = require('../models/Location');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const { cloudinary } = require('../cloudinary/index');
const { locationSchema } = require('../schemas');

//SHOWING LOCATIONS PAGE 
module.exports.index = async (req,res) => {
    const locations = await Location.find({});
    res.render('locations/index', {locations})
}

//LOCATION NEW PAGE
module.exports.renderNewForm = (req, res) => {
    res.render('locations/new');
}

//CREATE A NEW LOCATION
module.exports.createLocation = async(req,res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.locations.location,
        limit: 1
    }).send()
   const locations = new Location(req.body.locations);
   locations.geometry = geoData.body.features[0].geometry;//models/location.js line 19-- grabbing geodata from boding and parsing the json
   locations.images = req.files.map(f => ({url: f.path, filename: f.filename}));//map over array thats been added to req.files thanks to multer/take path/filename make new object for each
   locations.author = req.user._id; //DEFINING WHICH USER IS ON THE PAGE IF THEY ADD LOCATION THEIR NAME WILL SHOW
   await locations.save();
   console.log(locations);
   req.flash('success', 'Successfully added a new location!');
   res.redirect(`/locations/${locations._id}`)
       
}

//SHOW LOCATION
module.exports.showLocation = async (req,res) => {
    const locations = await Location.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }//POPULATING AUTHOR OF EACH REVIEW
    }).populate('author');
    if(!locations){
        req.flash('error', 'Location does not exist!');
        return res.redirect('/locations');
    }
    res.render('locations/show', {locations});
}

//EDIT LOCATION
module.exports.renderEditForm = async(req,res) => {
    const {id} = req.params;
    const locations = await Location.findById(id)
    if(!locations){
        req.flash('error', 'Location does not exist!');
        return res.redirect('/locations');
    }
    res.render('locations/edit', {locations});
}

//UPDATE LOCATION
module.exports.updateLocation = async(req,res) => {
    const {id} = req.params;//FIND LOCATION ID
    const locations = await Location.findByIdAndUpdate(id, {...req.body.locations});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    locations.images.push(...imgs);
    await location.save()
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages ){//for each filename call-
            await cloudinary.uploader.destroy(filename);//removing images from cloudinary when deleted


        }
       await locations.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}} }) //$pull - to pull elements out of an array
    }//deleting specific images from location
   
    req.flash('success', 'Successfully updated location!')
    res.redirect(`/locations/${locations._id}`)
}

//DELETE LOCATION
module.exports.deleteLocation = async(req,res) => {
    const {id} = req.params;
    await Location.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted location!')
    res.redirect('/locations');
 }