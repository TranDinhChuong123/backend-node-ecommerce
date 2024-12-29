
const { cart } = require('../models/cart.model')
const { findCart } = require('../models/repositories/cart.repo')
const { getProductById } = require('../models/repositories/product.repo')
const { NotFoundError } = require('../core/error.response')
class CartService {

    static async createCart({ userId, product }) {
        const filter = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product
                }

            }, options = { upsert: true, new: true }

        return await cart.findOneAndUpdate(filter, updateOrInsert, options)



    }

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product
        const filter = {
            cart_userId: userId,
            cart_state: 'active',
            'cart_products.productId': productId
        }, updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }, options = { upsert: true, new: true }

        return await cart.findOneAndUpdate(filter, updateSet, options)
    }


    static async addToCart({ userId, product = {} }) {

        //1. check cart exits
        const userCart = await findCart({
            cart_userId: userId
        })
        // 2.
        if (!userCart) {
            return await CartService.createCart({ userId, product })
        }

        // 2.if cart exist but product not exit
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            // chu y phai phuong thuc cua mongose ko dc lean() moi su dung dc save()
            return await userCart.save()
        }
        //2.  if cart exist and product exist in cart 
        return await CartService.updateUserCartQuantity({ userId, product })
    }

    /*
        {
            "userId": 1001,
            "shop_order_ids": [
                {
                    "shopId":"662fb0bc1f812ca0a80a8320",
                    "item_products": [
                        {
                            "productId":"66646aff788d20b7a5b6021f",
                            "shopId":"662fb0bc1f812ca0a80a8320",
                            "quantity":19,
                            "old_quantity":2,
                            "name":"Com bo 2 ao thun cotton Compact Preium tre trun",
                            "price":111
                        }
                    ],
                    "version": 2000
                }     
            ]
        }
    */
    static async addToCartV2({ userId, shop_order_ids = {} }) {

        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError('Not Found Product by id!')


        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product do not belong to the shop !')
        }
        if (quantity === 0) {

        }
        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }
    static async deleteUserCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            }

        const deleteCart = await cart.updateOne(query, updateSet)

        return deleteCart
    }

    static async getListUserCart({ userId }) {
        return await cart.findOne({
            cart_userId: +userId
        }).lean()
    }
}

module.exports = CartService