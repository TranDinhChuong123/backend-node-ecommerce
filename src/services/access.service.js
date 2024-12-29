'user strict'

const bcrypt = require('bcrypt')

const crypto = require('crypto')

const _Shop = require('../models/shop.model')
const { findByRefeshToken, createKeyToken, findByRefeshTokenUsed, deleteKeyByUserId, removeKeyById } = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { BadResquestError, ConflictResquestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')
const { getInfoData } = require('../utils/index')




const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WIRTER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessSevice {



    static handlerRefeshToken = async ({ keyStore, user, refreshToken }) => {
        // 1. find token used
   
        const { userId, email } = user;
        
        if(keyStore.refreshTokenUsed.includes(refreshToken)){
            await deleteKeyByUserId({ userId })
            throw new ForbiddenError('Something happend !! Pls relogin')
        }

        if(keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered')


        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError('Shop not registered')

        const tokens = await createTokenPair({ userId: shopByEmail._id, email }, keyStore.publicKey, keyStore.privateKey)

        keyStore.update({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokenUsed: refreshToken,
            }
        })
        return {
            user: { userId, email },
            tokens
        }


     // const foundToken = await findByRefeshTokenUsed(refreshToken)

        // if (foundToken) {
        //     //1.1 verify token
        //     const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
        //     // 1.2 deldeleteKeyByUserId
        //     await deleteKeyByUserId({ userId })
        //     throw new ForbiddenError('Something happend !! Pls relogin')
        // }

        // //2. No find 
        // // 2.1 holderToken
        // const holderToken = await findByRefeshToken(refreshToken)
        // if (!holderToken) throw new AuthFailureError('Shop not registered')

        // // 2.2 verify refreshToken
        // // const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)

        // const foundShop = await findByEmail({ email });
        // if (!foundShop) throw new AuthFailureError('Shop not registered')

        // const tokens = await createTokenPair({ userId: shopByEmail._id, email }, holderToken.publicKey, holderToken.privateKey)

        // holderToken.update({
        //     $set: {
        //         refreshToken: tokens.refreshToken,
        //     },
        //     $addToSet: {
        //         refreshTokenUsed: refreshToken,
        //     }
        // })
        // return {
        //     user: { userId, email },
        //     tokens
        // }

    }

    static signIn = async ({ email, password }) => {

        // 1. 
        const shopByEmail = await findByEmail({ email })
        // const shopByEmail = await _Shop.findOne({ email }).lean();
        console.log('shopByEmail :', shopByEmail);
        if (!shopByEmail) throw new BadResquestError('Shop not registered')

        // 2.
        const match = bcrypt.compare(password, shopByEmail.password);
        if (!match) throw new AuthFailureError('Authentication error')

        // 3.
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }
        });
        console.log({ privateKey, publicKey });
   

        // 4.
        const tokens = await createTokenPair({ userId: shopByEmail._id, email }, publicKey, privateKey);
        if (!tokens) throw new BadResquestError('tokes fail')

        console.log('token :', tokens);
    
        // update token 
        const publicKeyString = await createKeyToken({
            userId: shopByEmail._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        })
        if (!publicKeyString) throw new BadResquestError('tokes fail')

        return {
            shop: getInfoData({ fileds: ['_id', 'name', 'email',], object: shopByEmail }),
            tokens
        }

    };

    static signUp = async ({ name, email, password }) => {
        // try {

        // step 1: check email shop registerd
        const holderShop = await _Shop.findOne({ email }).lean();
        if (holderShop) {
            throw new BadResquestError('Error: Shop already registerd')
        }

        // step 2: new shop 
        const passwordHash = await bcrypt.hash(password, 10)
        const newShop = await _Shop.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })
        console.log('shop :', newShop);

        // create token to new shop
        if (newShop) {

            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                }
            });


            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            if (!tokens) throw new BadResquestError('Created tokens fail')

            const publicKeyString = await createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken
            })

            if (!publicKeyString) throw new BadResquestError('tokes fail')

            return {
                shop: newShop,
                tokens
            }

        }
        return null;


    }

    static logOut = async ( keyStore ) => {
        const delKey = await removeKeyById( keyStore._id );
        console.log('delKey :' , delKey);
        return delKey;
    }
}

module.exports = AccessSevice



// Bước 1: Tạo hàm làm mới Access Token
// app.post('/refresh-token', (req, res) => {
//     const refreshToken = req.body.token;
//     if (!refreshToken) return res.sendStatus(401);
//     if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//       if (err) return res.sendStatus(403);
//       const accessToken = generateAccessToken({ name: user.name });
//       res.json({ accessToken });
//     });
//   });
  
// Bước 2: Xử lý lỗi hết hạn Access Token trên Client

// const API_URL = 'http://localhost:4000';

// async function fetchWithAuth(url, options = {}) {
//   const accessToken = localStorage.getItem('accessToken');
//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       ...options.headers,
//       'Authorization': `Bearer ${accessToken}`
//     }
//   });

//   if (response.status === 401) {
//     const refreshToken = localStorage.getItem('refreshToken');
//     const newAccessToken = await getNewAccessToken(refreshToken);

//     if (newAccessToken) {
//       localStorage.setItem('accessToken', newAccessToken);
//       return fetchWithAuth(url, options); // Retry the original request with new access token
//     } else {
//       // Redirect to login page or show a message
//       window.location.href = '/login';
//     }
//   } else {
//     return response;
//   }
// }

// async function getNewAccessToken(refreshToken) {
//   const response = await fetch(`${API_URL}/refresh-token`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ token: refreshToken })
//   });

//   if (response.ok) {
//     const data = await response.json();
//     return data.accessToken;
//   } else {
//     return null;
//   }
// }

// Bước 3: Xử lý khi Refresh Token hết hạn
// app.post('/refresh-token', (req, res) => {
//     const refreshToken = req.body.token;
//     if (!refreshToken) return res.sendStatus(401);
//     if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//       if (err) return res.sendStatus(403); // Refresh token is invalid or expired
//       const accessToken = generateAccessToken({ name: user.name });
//       res.json({ accessToken });
//     });
//   });
  

// Bước 4: Đăng nhập lại
// Nếu Refresh Token hết hạn, người dùng sẽ phải đăng nhập lại
//  để lấy Access Token và Refresh Token mới. Bạn có thể làm điều
//   này bằng cách chuyển hướng người dùng đến trang đăng nhập
// if (newAccessToken) {
//     localStorage.setItem('accessToken', newAccessToken);
//     return fetchWithAuth(url, options); // Retry the original request with new access token
//   } else {
//     // Redirect to login page or show a message
//     window.location.href = '/login';
//   }
  
