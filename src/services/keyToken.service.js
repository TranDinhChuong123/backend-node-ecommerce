'use strict'

const { Types } = require('mongoose');
const _Key = require('../models/keytoken.model')
class keyTokenService {

    static findByRefeshTokenUsed = async (refreshToken) => {
        return await _Key.findOne({ refeshTokensUsed: refreshToken }).lean();
    }

    static findByRefeshToken = async (refreshToken) => {
        return await _Key.findOne({ refreshToken });
    }
    static deleteKeyByUserId = async (userId) => {
        return await _Key.findByIdAndDelete({ user: Types.ObjectId(userId) }).lean()
    };
    static removeKeyById = async (id) => {
        return await _Key.deleteOne(id);
    }
    static findByUserId = async (userId) => {
        return await _Key.findOne({ user: new Types.ObjectId(userId) }).lean();
    }
    static deleteKeyByUserId = async (userId) => {
        return await _Key.findByIdAndDelete(Types.ObjectId(userId)).lean();
    };
    



    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        console.log('privateKey :', privateKey);
        console.log('refreshToken :', refreshToken);

        const filter = { user: userId }, update = {
            publicKey, privateKey, refreshTokensUsed: [], refreshToken
        }, options = { upsert: true, new: true }

        const tokens = await _Key.findOneAndUpdate(filter, update, options)

        return tokens ? tokens.publicKey : null
    }


}
module.exports = keyTokenService