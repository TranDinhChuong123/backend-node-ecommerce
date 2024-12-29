'use strict'

const StatusCode = {
    CREATED: 201,
    OK: 200,
}
const ReasonStatusCode = {
    CREATED: 'Created',
    OK: 'Success',
}

class SuccessResponse {
    constructor({ options = {}, message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
        this.options = options;
    }

    send(res, header = {}) {
        return res.status(this.status).json(this)
    }
 
}

class OK extends SuccessResponse {
    constructor(message, metadata) {
        super(message, metadata);

    }
}

class CREATED extends SuccessResponse {
    constructor(message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.OK, metadata = {}) {
        super(message, statusCode, reasonStatusCode, metadata);

    }
}


module.exports = {
    OK, CREATED, SuccessResponse
}