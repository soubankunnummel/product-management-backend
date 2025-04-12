"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = require("../config/config");
const error_handler_1 = require("./error-handler");
const user_1 = __importDefault(require("../models/user"));
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    // Check for token in Authorization header
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    // Make sure token exists
    if (!token) {
        return next(new error_handler_1.AppError("Not authorized to access this route", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    try {
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        // Set user to req.user
        req.user = yield user_1.default.findById(decoded.id).select("-password");
        next();
    }
    catch (error) {
        return next(new error_handler_1.AppError("Not authorized to access this route", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
});
exports.protect = protect;
