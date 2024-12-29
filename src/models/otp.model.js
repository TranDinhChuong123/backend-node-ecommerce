'use strict';

const { Schema, model } = require('mongoose')

// !mdbgum
const OtpSchema = new Schema({
    email: String,
    otp: String,
    time: { type: Date, default: Date.now, index: { expires: 60 } }  // 60 seconds expries


}, {
    collection: 'otp',
})

module.exports = model('otp', OtpSchema)


