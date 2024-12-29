'use strict'

const { BadResquestError } = require('../core/error.response');
const { product, clothing, electronic, funiture } = require('../models/product.model')
const { updateProductById, findProduct, findAllProducts, searchProductByUser, findAllProductDraftsForShop, pulishProductByShop, findAllProductIsPublishedForShop, unPulishProductByShop } = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils');


class ProductFactory {

    // QUERY    



    static async findProduct({ product_id, unSelect }) {
        return await findProduct({ product_id, unSelect: ['__v', 'product_variations'] })
    }

    static async findAllProducts({
        limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true }
    }) {
        const select = ['product_name', 'product_price', 'product_thumb']
        return await findAllProducts({ limit, sort, page, filter, select })
    }


    static async searchProductByUser({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async unPulishProductByShop({ product_shop, product_id }) {
        return await unPulishProductByShop({ product_shop, product_id })
    }

    static async pulishProductByShop({ product_shop, product_id }) {
        return await pulishProductByShop({ product_shop, product_id })
    }
    static async findAllProductDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllProductDraftsForShop({ query, limit, skip })
    }
    static async findAllProductIsPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllProductIsPublishedForShop({ query, limit, skip })
    }

    static productRegistry = {};

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadResquestError(`Invalid product type error ${type}`);
        return new productClass(payload).createProduct()
    }


    static async updateProduct(type, product_id, payload) {
        console.log("payload ", payload);
        console.log("product_id ", product_id);
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadResquestError(`Invalid product type error ${type}`);
        return new productClass(payload).updateProduct(product_id)
    }




}

class Product {
    constructor({ product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb; // Đổi tên thành product_thumb
        this.product_description = product_description; // Đổi tên thành product_description
        this.product_price = product_price; // Đổi tên thành product_price
        this.product_quantity = product_quantity; // Đổi tên thành product_quantity
        this.product_type = product_type; // Đổi tên thành product_type
        this.product_shop = product_shop; // Đổi tên thành product_shop
        this.product_attributes = product_attributes; // Đổi tên thành product_attributes
    }


    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id })
    }

    async updateProduct(product_id, bodyUpdate) {
        return await updateProductById({ product_id, bodyUpdate, model: product })
    }
}

class Clothing extends Product {

    async createProduct() {
        // 1 newClothing
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadResquestError('create clothing errror')

        // 2 newProduct
        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadResquestError('create newProduct errror')

        return newProduct;
    }
    async updateProduct(product_id) {

        const objectPrams = this
        console.log("objectPrams", objectPrams);
        if (objectPrams.product_attributes) {
            // update child
            await updateProductById({ product_id, bodyUpdate: objectPrams, model: clothing })
        }

        const updateProduct = await super.updateProduct({ product_id, objectPrams })
        return updateProduct
    }
}
class Electronic extends Product {

    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadResquestError('create clothing errror')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadResquestError('create newProduct errror')

        return newProduct;
    }
    // async updateProduct(product_id) {
    //     const updateNest = updateNestedObjectParser
    //     // console.log('[1]::', this);
    //     const objectPrams = removeUndefinedObject(this)
    //     // console.log('[2]::', objectPrams);
    //     if (objectPrams.product_attributes) {
    //         // update child
    //         await updateProductById({
    //             product_id,
    //             bodyUpdate: updateNestedObjectParser(objectPrams.product_attributes),
    //             model: electronic
    //         })
    //     }

    //     const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectPrams))
    //     return updateProduct
    // }
    async updateProduct(productId) {
        const updateNest = updateNestedObjectParser(this);
        const objectParams = removeUndefinedObject(updateNest);
        if (objectParams.product_attributes) {
            updateProductById({ productId, bodyUpdate: objectParams, model: electronic });
        }
        const updateProduct = await super.updateProduct(productId, objectParams);
        return updateProduct;
    }
}

class Funiture extends Product {

    async createProduct() {
        const newFuniture = await funiture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFuniture) throw new BadResquestError('create clothing errror')

        const newProduct = await super.createProduct(newFuniture._id)
        if (!newProduct) throw new BadResquestError('create newProduct errror')

        return newProduct;
    }
    async updateProduct(product_id) {
        console.log('[1]::', this);
        const objectPrams = removeUndefinedObject(this)
        console.log('[2]::', objectPrams);
        if (objectPrams.product_attributes) {
            // update child
            await updateProductById({ product_id, bodyUpdate: objectPrams, model: electronic })
        }

        const updateProduct = await super.updateProduct({ product_id, objectPrams })
        return updateProduct
    }
}

ProductFactory.registerProductType("Clothing", Clothing)
ProductFactory.registerProductType("Electronics", Electronic)
ProductFactory.registerProductType("Funiture", Funiture)

module.exports = ProductFactory