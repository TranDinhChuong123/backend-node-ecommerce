'use strict'


const asyncHandler = require('../helper/asyncHandler');
const { AuthFailureError, BadResquestError, NotFoundError } = require('../core/error.response');
const JWT = require('jsonwebtoken');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'refreshToken',
}


const createTokenPair = async (payload, publicKey, privateKey) => {
    try {

        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.error('Verification failed:', err.message);
            } else {
                console.log('Decoded user:', decoded);
            }

        })
        return { accessToken, refreshToken }

    } catch (error) {
        console.error('Error creating token pair:', error);
        throw new BadResquestError('Failed to create token pair');
    }
}

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

const authentication = asyncHandler(async (req, res, next) => {

    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid header request  !')

    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found keyStore !')

    if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
            console.log('decodeUser :', decodeUser);
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid request !')
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        } catch (error) {
            throw error
        }
    }


    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new NotFoundError('Invalid authentication request !')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        console.log('decodeUser :', decodeUser);
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid request !')
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    } catch (error) {
        throw error
    }
})
module.exports = {
    verifyJWT,
    createTokenPair,
    authentication,
}