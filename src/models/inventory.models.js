const { Schema, model } = require('mongoose')


const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

const inventorySchema = new Schema({
    inven_productId: { type: Schema.ObjectId, ref: 'Product' },
    inven_location: { type: String, default: 'unKnow' },
    inven_stock: { type: Number, required: true }, /*số lượng hàng tồn kho*/
    inven_shopId: { type: Schema.ObjectId, ref: 'Shop' },
    inven_reservations: { type: Array, default: [] }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})



module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}