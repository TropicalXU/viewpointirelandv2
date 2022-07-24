if(process.env.NODE_ENV !== 'production') { //if we are running in development mode
    require('dotenv').config();//require dotenv which takes the variables defined in .env file
}//and add them in proccess.env in node app so we can access them in this file or any other files
//FROM .env file WE NOW HAVE ACCESS TO
//
//REQUIRING OUR PACKAGES --
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/users');
const locationRoutes = require('./routes/locations');
const reviewRoutes = require('./routes/reviews');

const MongoDBStore = require("connect-mongo");

const dbUrl = process.env.DB_URL

//CONNECTING TO DATABASE

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
 
});


const db = mongoose.connection; 
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
console.log('Database connected')
});

const app = express();
// APP CONFIGURATION
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//APP MIDDLEWARE
//TO PARSE THE REQUEST BODY
app.use(express.urlencoded({extended:true}));
//METHODOVERRIDE FOR DELETING AND EDITING POSTS
app.use(methodOverride('_method'));
//TO SERVE STATIC FILES SUCH AS IMAGES/CSS/JS FILES - BUILT IB MIDDLEWARE FUNC
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: ''
}))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

const secret = process.env.SECRET
const store =  MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60//IF NO DATA HAS CHANGED DONT UPDATE FOR 24HOURS
});

store.on('error', function(e){
    console.log('SESSION STORE ERROR',e)
})
//APP SESSIONS 
const sessionConfig = {
    store,
    name: 'session',//name used as cookie id so that it is not easy to identify if someone was to look for the session id-more secure
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        //httpOnly - used to protect cookird from client-side use
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(sessionConfig));
app.use(flash());


//INCLUDING OUR CONTENT SECURITY POLICY
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
    "https://cdn.jsdelivr.net",
  
];
const fontSrcUrls = [
    "https://fonts.gstatic.com",
    "https://cdnjs.cloudflare.com",
    "https://fonts.googleapis.com",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dhrs5mwhz/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//NEED PASSPORT SESSION MIDDLEWARE FOR PERSISTANT LOGIN SESSIONS
app.use(passport.initialize());//to initialize passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//we want passport to use User and call authenicate

passport.serializeUser(User.serializeUser());// telling passport how to serialzie a user ..serialization = how to store a user in the session
passport.deserializeUser(User.deserializeUser());// getting user out of a session

//CREATING FLASH MIDDLEWARE TO USE IN ROUTER TO ACCESS ANYWHERE
//on every single request what ever is in the flash
//under success we will have access to in our locals 
//under the key success
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
res.locals.success = req.flash('success');
res.locals.error = req.flash('error');
next();
});

//INCLUDING OUR ROUTES
app.use('/', userRoutes);
app.use('/locations', locationRoutes);
app.use('/locations/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/legal/privacyPolicy', (req, res) => {
    res.render('legal/privacyPolicy')
});

app.get('/legal/termsAndConditions', (req, res) => {
    res.render('legal/termsAndConditions')
});

//DEFINING OUR MAIN ERROR MESSAGING FOR ALL PAGES
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
   if(!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
    
})

const port = process.env.PORT || 3000;

//LISTEING ON PORT
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})

