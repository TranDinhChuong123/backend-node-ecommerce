'use strict'

const { NotFoundError, BadResquestError } = require('../core/error.response')
const { createDiscount, findDiscount, findAllDiscountCodesSelect, findAllDiscountCodesUnSelect, findDiscountExist } = require('../models/repositories/discount.repo')
const { findAllProducts } = require('../models/repositories/product.repo')
const { convertToObjectMongoDB } = require('../utils/index')
const discount = require('../models/discount.model')
const { Types } = require('mongoose')


class DiscountService {
    static async createDiscount(body) {
        // 1 . check date discount 

        if (new Date() < new Date(body.end_date)) {
            throw new BadResquestError("End date must be after the current date.");
        }


        console.log(" body.shopId ", body.shopId);
        const foundDiscount = await findDiscount(body.code, body.shopId)
        console.log(foundDiscount);
        if (foundDiscount) throw new NotFoundError(" Discount is exist! ")

        return await createDiscount(body)
    }
    /*
      get all products by discount
    */
    static async getAllDiscountCodesWithProduct({ code, shopId, userId, limit, page }) {
        const foundDiscount = await findDiscount(code, shopId)
        if (!foundDiscount) throw new BadResquestError(" Discount not exist! ")

        const { discount_applies_to, discount_product_ids } = foundDiscount

        let products
        if (discount_applies_to === 'all') {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectMongoDB(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['_id', 'product_name']
            })
        }

        if (discount_applies_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products
    }
    /*
        get all discount of shop
    */
    static async getAllDiscountCodesByShop({ shopId, limit, page }) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: new Types.ObjectId(shopId),
                discount_is_active: true
            },
            unSelect: ['__v'],
            model: discount
        })
        return discounts

    }

    static getDiscountAmount = async ({ code, shopId, userId, products }) => {
        console.log({ code, shopId, userId, products });
        const foundDiscount = await findDiscountExist({
            model: discount,
            filter: {
                discount_code: code,
                discount_shopId: new Types.ObjectId(shopId)
            }
        })
        if (!foundDiscount) throw new NotFoundError('Discount not exist !')

        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_start_date,
            discount_type,
            discount_end_date,
            discount_value
        } = foundDiscount

        if (!discount_is_active) throw new NotFoundError('Discount is expried !')
        if (!discount_max_uses) throw new NotFoundError('Discount are out!')

        // if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
        //     c
        // }

        let totalOrder = 0
        if (discount_min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(`Discount requires a minium order value of ${discount_min_order_value}`)
            }

        }

        // if (discount_max_uses_per_user > 0) {
        //     const userUserDiscount = discount_max_uses.find(user => user.userId === userId)
        //     if (userUserDiscount) {

        //     }
        // }

        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }


    }

    static async deleteDiscountCode({ shopId, codeId }) {

        const foundDiscount = await findDiscountExist({
            model: discount,
            filter: {
                discount_code: code,
                discount_shopId: Types.ObjectId(shopId)
            }
        })
        if (!foundDiscount) throw new NotFoundError('Discount not exist !')

        const deleted = await discount.findByIdAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectMongoDB(shopId)
        })

        return deleted
    }

    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await findDiscountExist({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectMongoDB(shopId)
            }
        })
        if (!foundDiscount) throw new NotFoundError('Discount not exist !')

        const result = await discount.findByIdAndUpdate({
            $pull: {
                discount_user_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })

        return result

    }



}

module.exports = DiscountService
