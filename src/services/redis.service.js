'use strict'


const redis = require('redis')
const { reservationInventory } = require('../models/repositories/inventory.repo')
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setxn).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    // tao key thanh toan 
    const key = `lock_v2023_${productId}`
    const retryTimes = 10
    const expriceTime = 3000;

    for (let i = 0; i < array.length; i++) {
        const result = await setnxAsync(key, expriceTime)
        console.log(`result:::`, result)

        if (result === 1) {
            // thao tac inventory
            const isReservation = await reservationInventory({
                productId, quantity, cartId
            })
            if(isReservation.modifiedCount){
                await pexpire(key,expriceTime)
                return key
            }
            return null
           
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }


    }


}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}