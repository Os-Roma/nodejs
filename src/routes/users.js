const express = require('express');
const router = express.Router();
const User = require('../models/User');

const passport = require('passport');


router.get('/signin', (req, res) => {
	res.render('users/signin');
});

router.get('/signup', (req, res) => {
	res.render('users/signup');
});

router.post('/signin', passport.authenticate('local', {
	successRedirect: '/notes',
	failureRedirect: '/signin',
	failureFlash: true
}));

//EXPRESS validator ????

router.post('/signup', async (req, res) => {
	const { name, email, password, confirmPassword } = req.body;
	const errors = [];
	if (name.length <= 0 ) {
		errors.push({ text: 'Please insert your name'});
	}
	if (email.length <= 0 ) {
		errors.push({ text: 'Please insert your email'});
	}
	if (password.length <= 0 ) {
		errors.push({ text: 'Please insert your password'});
	}
	if (confirmPassword.length <= 0 ) {
		errors.push({ text: 'Please confirm your password'});
	} else if (password.length < 4 ) {
		errors.push({ text: 'Password must be at least 4 characters' });
	} else if( password != confirmPassword ) {
		errors.push({ text: 'Password don´t match' });
	}

	if (errors.length > 0 ) {
		res.render('users/signup', { errors, name, email, password, confirmPassword });
	} else {
		const emailUser = await User.findOne({email: email});
		if (emailUser) {
			req.flash('error_msg', 'The email is already in use');
			res.render('users/signup', { name, email, password, confirmPassword });
		}
		const newUser = new User({name, email, password});
		newUser.password = await newUser.encryptPassword(password);
		await newUser.save();
		req.flash('success_msg', 'You are registered');
		res.redirect('/signin');
	}
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;