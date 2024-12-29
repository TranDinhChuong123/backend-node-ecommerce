'use strict'

const { findCartById } = require("../models/repositories/cart.repo")
const { BadResquestError } = require('../core/error.response')
const { checkProductByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require('../services/discount.service')
const { acquireLock, releaseLock } = require("./redis.service")
const { cart } = require("../models/cart.model")
const { order } = require('../models/order.model')

class CheckoutService {
    static async checkoutReview({
        cartId, userId, shop_order_ids = []
    }) {
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadResquestError('Cart does not exits!')

        const checkout_order = {
            totalPrice: 0, // tong tien hang 
            freeShip: 0, // phi van chuyen 
            totalDiscount: 0, // tong tien discount giam gia
            totalCheckout: 0, // tong tin thanh toan 
        }
        const shop_order_ids_new = []

        // tinh tong tien bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]

            const checkProductServer = await checkProductByServer(item_products)

            if (!checkProductServer[0]) {
                throw new BadResquestError('order wrong !!!')
            }

            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            checkout_order.totalPrice = +checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // time truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer

            }

            // neu shop_discounts ton tai >0 , check xem co hop le hay khong
            if (shop_discounts.length > 0) {
                // gia su chi co 1 discount
                // get amount discount
                console.log("checkProductByServer :::", checkProductByServer)

                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    code: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                // total discount 
                checkout_order.totalDiscount = +discount

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }

                //  tong thanh toan cuoi cung 



            }
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)


        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }


    // order 

    static async orderByUser({
        shop_order_ids_new,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await this.checkoutReview({
            cartId, userId, shop_order_ids: shop_order_ids_new
        })
        // check lai 1 lan nua vuot ton kho hay khong 
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log('[1]:::', products);
        const accquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i]
            const keyLock = await acquireLock(productId, quantity, cartId)
            accquireProduct.push(keyLock ? true : false)

            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        //  check if co mot san pham het hang trong kho thi sao
        if (accquireProduct.includes(false)) {
            throw new BadResquestError('Mot so san pham da duoc cap nhap! ')
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shiipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        //  truong hop : neu inser thanh cong thi remove prouduct trong my cart
        if (newOrder) {

        }
        return newOrder



    }
    /*
        1> Query orders [Users]
    */
    static async getOrderByUser(){

    }

    /*
        2> Cancel orders [Users]
    */
    static async cancelOrderByUser(){

    }

    /*
        3> Update Order Status orders [Shop | Admin]
    */ 
    static async updateOrderStatusByShop(){

    }


}

module.exports = CheckoutService

