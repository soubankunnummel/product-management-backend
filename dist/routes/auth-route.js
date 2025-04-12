"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Authentication related routes
 */
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const auth_cotroller_1 = require("../controller/auth-cotroller");
const auth_validation_1 = require("../validations/auth-validation");
const validate_request_1 = require("../middleware/validate-request");
const router = express_1.default.Router();
router.post('/register', (0, validate_request_1.validateRequest)(auth_validation_1.registerSchema), auth_cotroller_1.register);
router.post('/login', (0, validate_request_1.validateRequest)(auth_validation_1.loginSchema), auth_cotroller_1.login);
router.get('/me', auth_1.protect, auth_cotroller_1.getMe);
exports.default = router;
