/**
 * Logger utility for consistent logging throughout the application
 */

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


import winston from 'winston';
import { config } from '../config/config';

const logger = winston.createLogger({
  level: config.nodeEnv === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine( 
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;