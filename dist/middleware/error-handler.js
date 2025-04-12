"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    let error = Object.assign({}, err);
    error.message = err.message;
    // Log the error
    logger_1.default.error(`${err.name}: ${err.message}`);
    // Mongoose validation error
    if (err.name === 'ValidationError' && err.errors) {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new AppError(message, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    // Mongoose duplicate key
    if (err.code === 11000 && err.keyValue) {
        const field = Object.keys(err.keyValue)[0];
        const message = `Duplicate field value: ${field}. Please use another value.`;
        error = new AppError(message, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new AppError(message, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = new AppError('Invalid token. Please log in again.', http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    if (err.name === 'TokenExpiredError') {
        error = new AppError('Your token has expired. Please log in again.', http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    res.status(error.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(Object.assign({ success: false, error: error.message || 'Server Error' }, (process.env.NODE_ENV === 'development' && { stack: err.stack })));
};
exports.errorHandler = errorHandler;
