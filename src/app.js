const express = require('express');
const app = express();

const mongoose = require('./config/mongoose.config')
const compression = require('compression')
const helmet = require('helmet')
const morgan = require('morgan')

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(morgan('dev'));


app.use('/v1/api', require('./api/routes/index')); // Sử dụng router user với tiền tố '/v1'

app.use((req, res, next) => {
    const error = new Error('Not Found API');
    error.status = 404;
    next(error)
})


app.use((error, req, res, next) => {
    const status = error.status || 500;
    return res.status(status).json({
        status: 'error',
        code: status,
        stack: error.stack,
        message: error.message || 'Internal Server error'
    })
})


module.exports = app;

