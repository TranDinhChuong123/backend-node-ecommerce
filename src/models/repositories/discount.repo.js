const { max } = require('lodash')
const { BadResquestError } = require('../../core/error.response')
const discount = require('../discount.model')
const { Types } = require('mongoose')
const { convertToObjectMongoDB, getSelectData, UnGetSelectData } = require('../../utils')


const createDiscount = async (body) => {
    const {
        name, value, description, type, code, start_date, end_date,
        max_value, max_uses, uses_count, user_used, max_per_user,
        min_order_value, shopId, is_active, applies_to, product_ids
    } = body
    const newDiscount = discount.create({
        discount_name: name,
        discount_code: code,
        discount_type: type,
        discount_description: description,
        discount_start_date: start_date,
        discount_end_date: end_date,
        discount_is_active: is_active,

        discount_value: value,
        discount_max_value: max_value,
        discount_max_uses: max_uses,
        discount_uses_count: uses_count,

        discount_user_used: user_used,
        discount_max_uses_per_user: max_per_user,

        discount_min_order_value: min_order_value || 0,
        discount_applies_to: applies_to,
        discount_product_ids: applies_to === 'all' ? [] : product_ids,
        discount_shopId: shopId,

    })
    return newDiscount
}



const findDiscount = async (code, shopId) => {
    return await discount.findOne({
        discount_code: code,
        discount_shopId: new Types.ObjectId(shopId)
    }).lean()

}

const findDiscountExist = async ({ filter, model }) => {
    return await model.findOne(filter).lean()
}


const findAllDiscountCodesUnSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, unSelect, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const discounts = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(UnGetSelectData(unSelect))
        .lean() //Trả về các đối tượng JavaScript thuần thay vì các tài liệu Mongoose, giúp tăng hiệu suất truy vấn.


    return discounts
}

const findAllDiscountCodesSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, select, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const discounts = await discount.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean() //Trả về các đối tượng JavaScript thuần thay vì các tài liệu Mongoose, giúp tăng hiệu suất truy vấn.


    return discounts
}


module.exports = {
    findDiscountExist,
    findAllDiscountCodesSelect,
    findAllDiscountCodesUnSelect,
    createDiscount,
    findDiscount
}

