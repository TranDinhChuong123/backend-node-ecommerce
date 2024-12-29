'use strict'

const { model } = require('mongoose')
const apiKeyModel = require('../models/apiKey.model')
const crypto = require('crypto')
const { log } = require('console')

const findById = async (key) => {

    return await apiKeyModel.findOne({ key, status: true }).lean();

}

module.exports = {
    findById
}

