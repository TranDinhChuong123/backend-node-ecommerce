'use strict'

const { SuccessResponse } = require('../core/success.response')
const inventoryService = require('../services/inventory.serive')
class InventoryController {
    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'addStockToInventory success',
            metadata: await inventoryService.addStockInventory(req.body)
        }).send(res)
    }
}

module.exports = new InventoryController()