'use strict'

const { findById } = require("../services/apikey.service");


const HEADER = {
    API_KEY: 'x-api-key',
    // ATHORIZATION: 'athorization'
}
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        const objkey = await findById(key);
        if (!objkey) {
            return res.status(403).json({
                message: 'Forbiden api key Error'
            })
        }
        req.objkey = objkey
        return next();

    } catch (error) {
    }
};

const permission = (premission) => {
    return (req, res, next) => {
        console.log('req :', req.objkey);
        if (!req.objkey.permissions) {
            return res.status(403).json({
                message: 'permission denied '
            })
        }
        console.log('req.objkey.premissions', req.objkey.permissions);

        const validPermission = req.objkey.permissions.includes(premission);

        if (!validPermission) {
            return res.status(403).json({
                message: 'permission denied '
            })
        }
        console.log('validPermission :', validPermission);
        return next();
    }

}

module.exports = {
    apiKey, permission
}