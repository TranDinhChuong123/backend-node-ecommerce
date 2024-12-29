'use strict'

const express = require('express')
const router = express.Router();
const asyncHandler = require('../../helper/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const InventoryController = require('../../controllers/inventory.controller');



router.use(authentication)
router.post('/add_stock', asyncHandler(InventoryController.addStockToInventory));


module.exports = router;