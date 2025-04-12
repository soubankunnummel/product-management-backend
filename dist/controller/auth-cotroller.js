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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const error_handler_1 = require("../middleware/error-handler");
const user_service_1 = require("../service/user-service");
/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.userService.registerUser(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            token: result.token,
            user: result.user,
        });
    }
    catch (error) {
        const err = error;
        next(new error_handler_1.AppError(err.message, http_status_codes_1.StatusCodes.BAD_REQUEST));
    }
});
exports.register = register;
/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate email & password
        if (!email || !password) {
            return next(new error_handler_1.AppError("Please provide an email and password", http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        const result = yield user_service_1.userService.loginUser(email, password);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            token: result.token,
            user: result.user,
        });
    }
    catch (error) {
        const err = error;
        next(new error_handler_1.AppError(err.message, http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
});
exports.login = login;
/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return next(new error_handler_1.AppError("Not authorized", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        }
        const user = yield user_service_1.userService.getUserById(req.user.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getMe = getMe;
