"use strict";
/**
 * Logger utility for consistent logging throughout the application
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { createLogger, format, transports } from "winston";
// const { combine, timestamp, json, colorize } = format;
// // Custom format for console logging with colors
// const consoleLogFormat = format.combine(
//     format.colorize(),
//     format.printf(({ level, message, timestamp }) => {
//         return `${level}: ${message}`;
//     })
// );
// // Create a Winston logger
// const logger = createLogger({
//     level: "info",
//     format: combine(colorize(), timestamp(), json()),
//     transports: [
//         new transports.Console({
//             format: consoleLogFormat
//         }),
//         new transports.File({ filename: "app.log" })
//     ]
// });
// export default logger;
const winston_1 = __importDefault(require("winston"));
const config_1 = require("../config/config");
const logger = winston_1.default.createLogger({
    level: config_1.config.nodeEnv === 'development' ? 'debug' : 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
        }),
        new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'logs/combined.log' }),
    ],
});
exports.default = logger;
