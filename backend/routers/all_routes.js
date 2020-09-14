const express = require('express');
const registerUser = require('./register_user_api.js');
const userSignIn = require('./signin_api.js');
const generalApi = require('../middleware/general_api.js');

const router = express.Router();

// api to for user registration
router.post('/registerUser', function (req, res) {
	registerUser(req, res);
});

router.post('/signIn', function (req, res) {
	userSignIn(req, res);
});

module.exports = router;