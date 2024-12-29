'use strict'

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../helper/asyncHandler');
const ProductController = require('../../controllers/product.controller');
const { authentication } = require('../../auth/authUtils');

router.get('/search/:keySearch', asyncHandler(ProductController.getListSearchProductByUser));
router.get('', asyncHandler(ProductController.getAllProducts));
router.get('/:product_id', asyncHandler(ProductController.getProduct));


router.use(authentication)


router.get('/drafts/all', asyncHandler(ProductController.getAllProductDraftsForShop));
router.get('/published/all', asyncHandler(ProductController.getAllProductIsPublishedForShop));

router.post('/createProduct', asyncHandler(ProductController.createProduct));
router.post('/publish/:id', asyncHandler(ProductController.pulishProductByShop));
router.post('/unpublish/:id', asyncHandler(ProductController.unPulishProductByShop));

router.patch('/update/:id', asyncHandler(ProductController.updateProduct));

module.exports = router;
