'use strict'

const express = require('express')
const router = express.Router();
const asyncHandler = require('../../helper/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const CheckOutController = require('../../controllers/checkout.controller');


router.use(authentication)

router.post('/review', asyncHandler(CheckOutController.checkoutReview));


module.exports = router;