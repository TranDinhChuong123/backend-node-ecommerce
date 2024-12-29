const { convertToObjectMongoDB } = require("../../utils")
const { cart } = require("../cart.model")

const findCart = async ({ filter }) => {
    return cart.findOne(filter)
}

const findCartById = async (cartId) => {
    return await cart.findById(convertToObjectMongoDB(cartId)).lean()
}

module.exports = {
    findCartById,
    findCart
}
