"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
/**
 * Application configuration settings loaded from environment variables
 */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '8080', 10),
    mongoURI: process.env.MONGO_URI || '',
    jwtSecret: process.env.JWT_SECRET || '',
    jwtExpire: process.env.JWT_EXPIRE || '30d',
};
