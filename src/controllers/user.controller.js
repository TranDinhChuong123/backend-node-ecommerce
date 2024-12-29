const userService = require('../services/user.service');

module.exports = {
    vertifyOtp: async (req, res, next) => {
        const { email, otp } = req.body
        console.log(req.body);

        console.log('email : ', email);
        try {
            const element = await userService.vertifyOtp({ email, otp })
            return res.json(element)
        } catch (error) {
            console.error(error);
        }
    },

    registerUser: async (req, res, next) => {
        try {
            const { email } = req.body;
            // console.log(email);
            res.json({
                element: await userService.registerUser({ email })
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createUser: async (req, res, next) => {
        try {

            const { userId, username, email } = req.body;
            console.log(req.body);
            res.json({
                element: await userService.createUser({ userId, username, email })
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getMethods: async (req, res, next) => {
        try {
            res.json({
                message: await userService.getMethods()

            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getStatics: async (req, res, next) => {
        try {
            res.json({
                message: await userService.getStatics()
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
