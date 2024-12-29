'use strict'

const { searchProductByUser, createProduct, findAllProductDraftsForShop, pulishProductByShop, findAllProductIsPublishedForShop, unPulishProductByShop, findAllProducts, findProduct, updateProduct } = require('../services/product.service')
const { CREATED, SuccessResponse } = require("../core/success.response")

class ProductController {

    static getProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "GetProduct success",
            metadata: await findProduct({
                product_id: req.params.product_id
            }),
        }).send(res)
    }

    static getAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "GetAllProducts success",
            metadata: await findAllProducts(req.query),
        }).send(res)
    }


    static getListSearchProductByUser = async (req, res, next) => {
        new SuccessResponse({
            message: "getListSearchProductByUser success",
            metadata: await searchProductByUser({
                keySearch: req.params.keySearch
            }),
        }).send(res)
    }

    static createProduct = async (req, res, next) => {
        new CREATED({
            message: "Create new product success",
            metadata: await createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            }),
        }).send(res)
    }

    static updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Update product success",
            metadata: await updateProduct(req.body.product_type, req.params.id, {
                ...req.body,
                product_shop: req.user.userId
            }),
        }).send(res)
    }

    static getAllProductDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list Draft success!",
            metadata: await findAllProductDraftsForShop({ product_shop: req.user.userId }),
        }).send(res)
    }

    static getAllProductIsPublishedForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list is Published success!",
            metadata: await findAllProductIsPublishedForShop({ product_shop: req.user.userId }),
        }).send(res)
    }

    static pulishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish success!",
            metadata: await pulishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            }),
        }).send(res)
    }

    static pulishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish success!",
            metadata: await pulishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            }),
        }).send(res)
    }

    static unPulishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "UnPulishProductByShop success!",
            metadata: await unPulishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            }),
        }).send(res)
    }


}

module.exports = ProductController