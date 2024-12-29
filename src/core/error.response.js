'use strict'

const { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } = require('http-status-codes')

const StatusCode = {
    FORBIDEN: 403,
    CONFLICT: 409,
}
const ReasonStatusCode = {
    FORBIDEN: 'Bad request error',
    CONFLICT: 409,
}



class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class ConflictResquestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDEN) {
        super(message, statusCode);

    }
}

class BadResquestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDEN, statusCode = StatusCode.FORBIDEN) {
        super(message, statusCode);

    }
}
class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode);

    }
}
class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode);

    }
}
class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode);

    }
}


module.exports = {
    ConflictResquestError,
    BadResquestError,
    AuthFailureError,
    ForbiddenError,
    NotFoundError
}