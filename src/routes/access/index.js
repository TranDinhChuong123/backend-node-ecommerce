'use strict'

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../helper/asyncHandler');
// const { getStatics, getMethods, createUser, registerUser, vertifyOtp } = require('../controllers/user.controller');
const { signUp, signIn, logOut } = require('../../controllers/access.controler');
const { authentication } = require('../../auth/authUtils');
const { handlerRefeshToken } = require('../../services/access.service');



router.post('/shop/signUp', asyncHandler(signUp));
router.post('/shop/signIn', asyncHandler(signIn));

router.use(authentication)

router.post('/shop/logOut', asyncHandler(logOut));
router.post('/shop/handlerRefeshToken',asyncHandler(handlerRefeshToken))



module.exports = router;
