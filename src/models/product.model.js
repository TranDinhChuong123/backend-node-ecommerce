'use strict'

const { size } = require("lodash");
const { Schema, model } = require("mongoose");
const { default: slugify } = require("slugify");

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'



const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_slug: { type: String }, //ao-nam-cao-cap
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }, // tham chieu den Shop
    product_attributes: { type: Schema.Types.Mixed, required: true },

    // more
    product_ratingsAverge: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10

    },
    product_variations: { type: Array, default: [] }, // dien bao nhieu gb co mau gi mau gi
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },

}, {
    collection: COLLECTION_NAME,
    timestamps: true
});


// create index for search
productSchema.index({ product_name: 'text', product_description: 'text' })

// Document middlware 
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next();

})

const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'clothes',
    timestamps: true
})

const electronicSchema = new Schema({
    brand: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'electronics',
    timestamps: true
})

const funitureSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'funitures',
    timestamps: true
});


module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model('Electronic', electronicSchema),
    clothing: model('Clothing', clothingSchema),
    funiture: model('Funiture', funitureSchema)
}
