'use strict'

const mongoose = require('mongoose'); // Erase if already required
const COLLECTION_NAME = 'Keys'
const DOCUMENT_NAME = 'Key'
// Declare the Schema of the Mongo model
var keytokenSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Shop' },
    publicKey: { type: String, required: true, },
    privateKey: { type: String, required: true, },
    refeshTokensUsed: {
        type: Array,
        defautk: [],
    },
    refreshToken: {
        type: String,
        required: true,
    },

}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keytokenSchema);