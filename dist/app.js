"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = __importDefault(require("./utils/logger"));
const not_fount_1 = require("./middleware/not-fount");
const error_handler_1 = require("./middleware/error-handler");
const routes_1 = __importDefault(require("./routes"));
const node_cron_1 = __importDefault(require("node-cron")); // Import node-cron
const https_1 = __importDefault(require("https")); // For sending requests
const app = (0, express_1.default)();
// middleware
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// rate limit
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
}));
// routes
app.use("/api/v1", routes_1.default);
//error handler
app.use(not_fount_1.notFound);
app.use(error_handler_1.errorHandler);
// Cron job to keep the server alive
node_cron_1.default.schedule("*/5 * * * *", () => {
    const url = "https://product-management-backend-849k.onrender.com/api/v1/";
    https_1.default.get(url, (res) => {
        logger_1.default.info(`Pinged ${url} - Status Code: ${res.statusCode}`);
    }).on("error", (err) => {
        logger_1.default.error(`Error pinging ${url}: ${err.message}`);
    });
    logger_1.default.info("Cron job executed to keep the server alive.");
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    logger_1.default.error(`-------------------------- ${err.message}----------------------------`);
    logger_1.default.error(err.stack);
    // Close server & exit process
    process.exit(1);
});
exports.default = app;
