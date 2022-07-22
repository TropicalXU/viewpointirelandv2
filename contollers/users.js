const User = require('../models/user');

//REGISTER USER form
module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

//MAKING/CREATING USER
module.exports.register = async (req, res, next) => {
    try {
    const {email, username, password} = req.body; //requesting username, email password from body
    const user = new User({email, username});//passing email, username into a new User
    const registeredUser = await User.register(user, password);// takes new user and password - hashes password/stores salts
    req.login(registeredUser, err => {//LOGIN USER AFTER REGISTERING
        if(err) return next(err);//YOU HAVE TO THROW IN AN ERR CALLBACK AND CALL NEXT
        req.flash('success', 'Welcome to Viewpoint Ireland!');
        res.redirect('/locations');//otherwise do this
    })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
  
}

//LOGIN FORM
module.exports.renderLogin =  (req, res) => {
    res.render('users/login')
}

//LOGIN
module.exports.login = (req, res) => { //authenticate passport using the local strategy with the options{flash, redirect}
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/locations' //FROM MIDLLEWARE WE CALL ON REQ.SESSION.RETURNTO TO REDIRECT USER TO ORIGINAL URL AFTER LOGGING IN
    delete req.session.returnTo; //removing returnTo data from the session
    res.redirect(redirectUrl);//calling on redirectUrl
  
}

//LOGOUT
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully Logged Out!')
    res.redirect('/locations')

}