
const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/auth.middleware");
const { register, login, googleAuth, completeGoogleSignup, getMe, verifyOtp, resendOtp, forgotPassword, resetPassword } = require("../controllers/auth.controller");
const { authLimiter } = require("../middlewares/rateLimit.middleware");

router.post('/register', authLimiter, register);
router.post('/verify-otp', authLimiter, verifyOtp);
router.post('/resend-otp', authLimiter, resendOtp);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/login', authLimiter, login);

// Step 1: verify Google id_token → login OR return needsPassword
router.post('/auth/google', authLimiter, googleAuth);

// Step 2: new Google user submits their chosen password → account created
router.post('/complete-google-signup', authLimiter, completeGoogleSignup);

router.get('/me', verifyToken, getMe);

module.exports = router;