const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    userId: { type: Number, required: true },
    email: String,
    name: String,
}, {
    collection: 'users',
    timestamps: true
})


module.exports = model('users', UserSchema);