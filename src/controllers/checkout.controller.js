'use strict'

const { CREATED, SuccessResponse } = require('../core/success.response')

const CheckOutService = require('../services/checkout.service')
class CheckOutController {
    static checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'checkoutReview successs',
            metadata: await CheckOutService.checkoutReview(req.body)
        }).send(res)
    }
}

module.exports = CheckOutController 