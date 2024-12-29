'user strict'
const _Shop = require('../models/shop.model')
const bcrypt = require('bcrypt')

const RoleShop ={
    SHOP : 'SHOP',
    WRITER :'WIRTER',
    EDITOR: 'EDITOR'
}
    
class ShopSevice{
    static findByEmail = async ({email, select = {
        email: 1, password: 2, name: 1, status: 1, roles: 1
    }}) => {
        return await _Shop.findOne({email}).select(select).lean();
    }

    static createShop = async ({ name, email, password}) =>{
        try {
            // step 1: check email 
            const holderShop = _Shop.findOne({email}).lean();
            if(holderShop){
                return {
                    code : 'xxxx',
                    message : 'Email is registerd'
                }
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await _Shop.create({
                name, email, password: passwordHash
            })



            
        } catch (error) {
            return{
                code :'xxxx',
                message : error.message,
                status : 'error',
            }
        }
    }
}

module.exports = ShopSevice