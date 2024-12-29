'use strict'

const { update } = require('lodash')
const { BadResquestError } = require('../core/error.response')
const {
    inventory
} = require('../models/inventory.models')
const { getProductById } = require('../models/repositories/product.repo')

class InventoryService {
    static async addStockInventory({
        stock,
        productId,
        shopId,
        location = '123 , Go Vap, Ho Chi Minh'
    }) {
        const product = await getProductById(productId)
        if (!product) throw new BadResquestError('the product wrong')

        const query = { inven_shopId: shopId, inven_productId: productId },
            updateSet = {
                $inc: {
                    inven_stock: stock
                },
                $set: {
                    inven_location: location
                }
            }, options = { upsert: true, new: true }

        return await inventory.findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryService