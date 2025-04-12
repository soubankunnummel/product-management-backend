"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const http_status_codes_1 = require("http-status-codes");
const error_handler_1 = require("./error-handler");
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const message = error.details.map((detail) => detail.message).join(", ");
            return next(new error_handler_1.AppError(message, http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        next();
    };
};
exports.validateRequest = validateRequest;
