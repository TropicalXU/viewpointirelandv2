const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const users = require('../contollers/users')

router.route('/register')
.get(users.renderRegister)//REGISTER USER form - controllers/users/renderRegister
.post( catchAsync(users.register)); //MAKING/CREATING USER - controllers/users/register

router.route('/login')
.get( users.renderLogin)//LOGIN FORM - controllers/users/renderLogin
.post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)//LOGIN -controllers/users/login

//LOGOUT - controllers/users/logout
router.get('/logout', users.logout);

module.exports = router;