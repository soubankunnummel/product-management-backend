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
exports.userService = void 0;
/**
 * Service for user related business logic
 */
const user_1 = __importDefault(require("../models/user"));
exports.userService = {
    /**
     * Register a new user
     */
    registerUser: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email, password } = userData;
        // Check if user already exists
        const userExists = yield user_1.default.findOne({ email });
        if (userExists) {
            throw new Error('User with this email already exists');
        }
        // Create user
        const user = yield user_1.default.create({
            name,
            email,
            password
        });
        // Generate token
        const token = user.getSignedJwtToken();
        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    }),
    /**
     * Login a user
     */
    loginUser: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        // Check for user
        const user = yield user_1.default.findOne({ email }).select('+password');
        if (!user) {
            throw new Error('Email not found');
        }
        // Check if password matches
        const isMatch = yield user.matchPassword(password);
        if (!isMatch) {
            throw new Error('Password does not match');
        }
        // Generate token
        const token = user.getSignedJwtToken();
        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    }),
    /**
     * Get user by ID
     */
    getUserById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_1.default.findById(id);
    })
};
