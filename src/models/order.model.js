const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const { convertToObjectMongoDB } = require('../utils/index')

const orderSchema = new Schema({
    order_userId: { type: Number, required: true },
    //{totalPrice,totalApplyDiscount,feeShip} 
    order_checkout: { type: Object, default: {} },
    // street, city ,state , countruy
    order_shipping: { type: Object, default: {} },
    order_payment: { type: Object, required: true },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String, default: '#000001202021' },
    order_status: { type: String, enum: ['pending', 'confimed', 'shipped', 'cancelled', 'delivered'], default: 'pending' }


}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createOn',
        updatedAt: 'modifiedOn'
    }
})



module.exports = {
    order: model(DOCUMENT_NAME, orderSchema)
}