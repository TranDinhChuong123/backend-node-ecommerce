'use strict'

const mongoose = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'
// Declare the Schema of the Mongo model
var shopSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    verify: { type: mongoose.Schema.Types.Boolean, default: false },
    roles: { type: Array, default: [] }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, shopSchema);