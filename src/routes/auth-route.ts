/**
 * Authentication related routes
 */
import express, { Router } from 'express';
import { protect } from '../middleware/auth';
import { getMe, login, register } from '../controller/auth-cotroller';
import { loginSchema, registerSchema } from '../validations/auth-validation';
import { validateRequest } from '../middleware/validate-request';
 

const router: Router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/me', protect, getMe);

export default router;