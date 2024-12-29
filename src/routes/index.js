const express = require('express');
const router = express.Router(); // Sử dụng express.Router() để tạo router mới
const { apiKey, permission } = require('../auth/checkauth')


router.use(apiKey)
router.use(permission('0000'))

router.use('/access', require('./access/index'));
router.use('/product', require('./product/index'));
router.use('/discount', require('./discount/index'));
router.use('/cart', require('./cart/index'));
router.use('/checkout', require('./checkout/index'));
router.use('/inventory', require('./inventory/index'));
module.exports = router;
