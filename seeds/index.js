const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Location = require('../models/Location');
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
   
});

const db = mongoose.connection; 
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
console.log('Database connected')
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Location.deleteMany({});
    for(let i = 0; i < 10; i ++){
        const random1000 = Math.floor(Math.random() * 10);
        const location = new Location({
          //YOUR USER ID-
            author: '62be1c056f2cd937eff376dc',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)}, ${sample(places)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. A atque doloremque nemo. Minima blanditiis reiciendis dolorum reprehenderit nemo cumque a, est ex, repudiandae sed adipisci, soluta provident eos perferendis veniam.',
            // price,
            geometry: {
              type: "Point",
              coordinates: [
                cities[random1000].longitute,
                cities[random1000].latitude,

              ]
          },
            images: [
              {
                url: 'https://res.cloudinary.com/dhrs5mwhz/image/upload/v1652198300/YelpCamp/pjd74368bk7giaivsxwy.jpg',
                filename: 'YelpCamp/pjd74368bk7giaivsxwy',
               
              },
              {
                url: 'https://res.cloudinary.com/dhrs5mwhz/image/upload/v1652198301/YelpCamp/rj0ew7pzwiseplivcln6.jpg',
                filename: 'YelpCamp/rj0ew7pzwiseplivcln6',
               
              }
            ]
           
            
        })
        await location.save();
        console.log(location);
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})