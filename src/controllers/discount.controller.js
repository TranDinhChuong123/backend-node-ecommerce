'use strict'

const { getAllDiscountCodesByShop, getDiscountAmount, createDiscount, getAllDiscountCodesWithProduct } = require('../services/discount.service')
const { CREATED, SuccessResponse } = require('../core/success.response')
class DiscountController {
    createDiscount = async (req, res, next) => {
        new CREATED({
            message: 'Create Discount success',
            metadata: await createDiscount(req.body),
        }).send(res);
    }

    getAllDiscountsCodesWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get List Product Code Success',
            metadata: await getAllDiscountCodesWithProduct({
                ...req.query,

            }),
        }).send(res);
    }

    getDiscountAmount = async (req, res, next) => {
        console.log(req.body);
        new SuccessResponse({
            message: 'Create Discount success',
            metadata: await getDiscountAmount({
                ...req.body
            }),
        }).send(res);
    }

    getAllDiscountCodesByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create Discount success',
            metadata: await getAllDiscountCodesByShop({
                ...req.query
            }),
        }).send(res);
    }





}

module.exports = new DiscountController()

