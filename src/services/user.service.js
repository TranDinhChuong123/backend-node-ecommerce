'use strict';

const _User = require('../models/user.model');
const _Otp = require('../models/otp.model')
const OtpGenerator = require('otp-generator')
const JWT = require('jsonwebtoken');
const { insertOtp, validOtp } = require('./otp.service')

var that = module.exports = {
    vertifyOtp: async ({ email, otp }) => {
        console.log("email :", email);

        const otpHolders = await _Otp.find({ email })
        console.log(otpHolders);
        if (!otpHolders.length) {
            return {
                code: 404,
                message: 'OTP Expired OTP!'
            }
        }
        const lastOtp = otpHolders[otpHolders.length - 1]

        const isValid = await validOtp({ otp, hashOtp: lastOtp.otp })
        if (!isValid) {
            return {
                code: 401,
                message: 'Invalid  OTP!'
            }
        }
        // && email === lastOtp.email
        if (isValid) {
            const user = await _User.create({
                username: 'Ronaldo',
                email: email,
                userId: 10,
            })
            if (user) {
                await _Otp.deleteMany({ email })
            }
            console.log('user :', user);
            return { code: 201, elements: user }
        }

    },

    registerUser: async ({ email }) => {
        const user = await _User.findOne({ email })

        if (user) {
            return {
                'status code': 400,
                message: 'This email is already in user'
            }
        }

        const token = JWT.sign({ email }, 'chuong', { expiresIn: '60s' })
        console.log('token :', token);

        if (!token) {
            return {
                'status code': 400,
                message: 'This email is already in user'
            }
        }
        const decoded = JWT.verify(token, 'chuong')
        console.log('decoded :', decoded);

        const decode = JWT.decode(token, 'chuong')
        console.log('decoded :', decoded);

        // const otp = Math.floor(Math.random() * (999999 - 100000) + 100000) + '';
        const otp = OtpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        })
        console.log('OTP :', otp);
        return { code: 200, elements: await insertOtp({ email, otp }) }
    },

    getStatics: async () => {
        return _User.getStatics();
    },
    getMethods: async () => {
        const __User = new _User();
        return __User.getMethods();
    },
    createUser: async ({ email, username, userId }) => {
        const user = new _User({ userId, username, email })
        return await user.save()
    }
};
// 'use strict';

// const _User = require('../models/user.model');
// const _Otp = require('../models/otp.model');
// const OtpGenerator = require('otp-generator');
// const { insertOtp, validOtp } = require('./otp.service');

// var that = module.exports = {
//     vertifyOtp: async (email, otp) => {
//         const otpHolders = await _Otp.find({ email });
//         if (!otpHolders.length) {
//             return {
//                 code: 404,
//                 message: 'OTP Expired OTP!'
//             };
//         }
//         const lastOtp = otpHolders[otpHolders.length - 1];

//         const isValid = await validOtp({ otp, hashOtp: lastOtp.otp });
//         if (!isValid) {
//             return {
//                 code: 401,
//                 message: 'Invalid  OTP!'
//             };
//         }

//         if (isValid && email === lastOtp.email) {
//             const user = await _User.create({
//                 username: 'Ronaldo',
//                 email: email,
//                 userId: 10,
//             });
//             if (user) {
//                 await _Otp.deleteMany({ email });
//             }
//             return { code: 201, elements: user };
//         }
//     },

//     // Các hàm khác...
// };






