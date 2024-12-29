'use strict'

// const { createUser, registerUser, vertifyOtp } = require('../controllers/user.controller');
const { signUp } = require('../../controllers/access.controler');
const userController = require('../../controllers/user.controller');

const express = require('express')
const router = express.Router();

router.get('/registerUser', userController.registerUser);
router.post('/createUser', userController.createUser);
router.post('/vertifyOtp', userController.vertifyOtp);
router.post('/signUp', signUp);

module.exports = router;
