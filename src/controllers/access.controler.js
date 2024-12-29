'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response")
const { signUp, signIn, logOut, handlerRefeshToken } = require("../services/access.service")

class AccessController {
    static handlerRefeshToken = async () => {
        new SuccessResponse({
            metadata: await handlerRefeshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            }),
        }).send(res)
    }
    static signIn = async (req, res, next) => {
        console.log('req.body :', req.body);
        new SuccessResponse({
            metadata: await signIn(req.body),
        }).send(res)
    }
    static signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered success',
            metadata: await signUp(req.body),
        }).send(res);
    
    }
    static logOut = async (req, res, next) => {
        console.log('keyStore :', req.keyStore);
        new SuccessResponse({
            message: 'Logout success',
            metadata: await logOut(req.keyStore),
        }).send(res)

    }
}

module.exports = AccessController