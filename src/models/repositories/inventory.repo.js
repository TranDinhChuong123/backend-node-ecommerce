const { update } = require('lodash')
const inventory = require('../inventory.models')


const insertInventory = async ({ productId, shopId, stock, location = 'unKnow' }) => {
    return await inventory.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_stock: stock,
        inven_location: location

    })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inven_productId: convertToObjectMongoDB(productId),
        inven_stock: { $gte: quantity }

    }, updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, options = {
        upsert: true, new: true
    }

    return await inventory.updateOne(query, updateSet, option)
}

module.exports = {
    insertInventory,
    reservationInventory
}