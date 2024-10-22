//import
const express = require('express');
const { registerUser } = require('../controllers/authController');
const { loginUser } = require('../controllers/authController');
const { admin } = require('../controllers/authController');
const { doctor } = require('../controllers/authController');

const router = express.Router();


//user registration
router.post('/register', registerUser);

//user login 
router.post('/login', loginUser);

//user appointment
router.post('/appointment', admin);

router.post('/provider', doctor);

module.exports = router;
