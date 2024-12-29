'use strict'

const { product, clothing, funiture, electronic } = require("../product.model")
const { Types } = require("mongoose")

const { getSelectData, UnGetSelectData, convertToObjectMongoDB } = require("../../utils/index")


const findProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id)
        .select(UnGetSelectData(unSelect))

}


const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean() //Trả về các đối tượng JavaScript thuần thay vì các tài liệu Mongoose, giúp tăng hiệu suất truy vấn.
    return products


}

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find(
        { isDraft: false, $text: { $search: regexSearch } },
        { score: { $meta: 'textScore' } }
    )
        .sort({ score: { $meta: 'textScore' } })
        .lean()
    return results
}

const unPulishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)

    })
    if (!foundProduct) return null

    foundProduct.isDraft = true
    foundProduct.isPublished = false
    const savedProduct = await foundProduct.save();

    return savedProduct ? 1 : 0;

}

const pulishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)

    })
    if (!foundProduct) return null

    foundProduct.isDraft = false
    foundProduct.isPublished = true
    const savedProduct = await foundProduct.save();

    return savedProduct ? 1 : 0;

}


const findAllProductDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllProductIsPublishedForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const updateProductById = async ({
    product_id,
    bodyUpdate,
    model,
    isNew = true
}) => {
    return await product.findByIdAndUpdate(product_id, bodyUpdate, { new: isNew })
}




const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec() // Thực hiện truy vấn và trả về một Promise. Đây là cách truy vấn MongoDB bất đồng bộ trong Mongoose.
}
const getProductById = async (product_id) => {
    return await product.findById(convertToObjectMongoDB(product_id)).lean()

}

const checkProductByServer = async (products) => {
    return await Promise.all(products.map(async product => {
        const foundProduct = await getProductById(product.productId)
        console.log("foundProduct", foundProduct);
        if (foundProduct) {
            return {
                price: foundProduct.product_price,
                quantity: foundProduct.product_quantity,
                productId: foundProduct._id
            }
        }
    }))
}

module.exports = {
    checkProductByServer,
    getProductById,
    updateProductById,
    findProduct,
    findAllProducts,
    searchProductByUser,
    unPulishProductByShop,
    pulishProductByShop,
    findAllProductIsPublishedForShop,
    findAllProductDraftsForShop
}