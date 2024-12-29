'use strict'

const express = require('express')
const router = express.Router();
const asyncHandler = require('../../helper/asyncHandler');
const { getDiscountAmount, createDiscount, getAllDiscountsCodesWithProduct, getAllDiscountCodesByShop } = require('../../controllers/discount.controller')
const { authentication } = require('../../auth/authUtils');

router.get('/list_product_code', asyncHandler(getAllDiscountsCodesWithProduct));
router.get('', asyncHandler(getAllDiscountCodesByShop));

router.use(authentication)

router.post('/create', asyncHandler(createDiscount));

router.post('/amount', asyncHandler(getDiscountAmount));

module.exports = router;
