
const User = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { sendVerificationEmail } = require("../utils/email");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async function (req, res) {
  try {
    const { password } = req.body;
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const normalizedEmail = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ error: "all fields required" });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ msg: "user already exist" });
      }
      // If user exists but is not verified, we can overwrite their password and resend OTP
    }

    const hashedpassword = await bcrypt.hash(password, 12);
    
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    if (!user) {
      user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedpassword,
        otp: hashedOtp,
        otpExpires,
        isVerified: false
      });
    } else {
      user.name = name;
      user.password = hashedpassword;
      user.otp = hashedOtp;
      user.otpExpires = otpExpires;
      await user.save();
    }

    // Send email
    const emailSent = await sendVerificationEmail(user.email, otp);
    
    if (!emailSent) {
      // Restore strict error handling since we expect the HTTP API to always work
      await User.deleteOne({ email: normalizedEmail, isVerified: false });
      return res.status(500).json({ error: "Failed to send verification email via HTTP API. Please check server configuration." });
    }

    return res.status(201).json({
      msg: "Verification code sent to your email",
      requiresVerification: true,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
};

const verifyOtp = async function (req, res) {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ msg: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ msg: "User already verified" });
    }

    if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: "OTP expired. Please register again." });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid verification code" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const payload = { id: user._id, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      msg: "Account verified successfully",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

const resendOtp = async function (req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (user.isVerified) return res.status(400).json({ msg: "User is already verified" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    const emailSent = await sendVerificationEmail(user.email, otp);
    
    if (!emailSent) {
      return res.status(500).json({ error: "Failed to resend verification email. Please check server email configuration." });
    }

    return res.status(200).json({ msg: "A new verification code has been sent to your email" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

const forgotPassword = async function (req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: "If an account exists, an email was sent" }); // Security best practice

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    const emailSent = await sendVerificationEmail(user.email, otp);
    if (!emailSent) {
      return res.status(500).json({ error: "Password resets are temporarily unavailable because the server's email provider is blocked by the host. Please contact support." });
    }

    return res.status(200).json({ msg: "If an account exists, an email was sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

const resetPassword = async function (req, res) {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ msg: "All fields are required" });
    if (newPassword.length < 8) return res.status(400).json({ msg: "Password must be at least 8 characters" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: "Invalid request" });
    if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: "OTP expired. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ msg: "Invalid verification code" });

    user.password = await bcrypt.hash(newPassword, 12);
    user.otp = undefined;
    user.otpExpires = undefined;
    // If they were resetting password on an unverified account, they proved email ownership
    user.isVerified = true;
    await user.save();

    return res.status(200).json({ msg: "Password reset successful. You can now log in." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

const login = async function (req, res) {
  try {
    const { password } = req.body;
    const normalizedEmail = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";

    if (!normalizedEmail || typeof password !== "string" || !password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ msg: "Please register first" });
    }

    if (!user.password) {
      return res.status(400).json({
        msg: "This account was created with Google. Please sign in with Google or set a platform password first.",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({ 
        msg: "Please verify your email address", 
        requiresVerification: true,
        email: user.email 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = { id: user._id, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      msg: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, picture: user.picture },
      token,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error" });
  }
};

// ─── Step 1: Google OAuth ────────────────────────────────────────────────────
// • Existing user  → login directly, return JWT
// • New user       → return needsPassword:true + a short-lived pendingToken
//                    (signed JWT containing verified Google data)
const googleAuth = async function (req, res) {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: "Google ID token is required" });
    }

    // Verify with Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const gp = ticket.getPayload();
    const { sub: googleId, email, email_verified, name, picture } = gp;

    if (!email || !email_verified) {
      return res.status(400).json({ error: "Google account must have a verified email address." });
    }
    const normalizedEmail = email.toLowerCase();

    // ── Existing user? ──────────────────────────────────────────────────────
    const existingUser = await User.findOne({
      $or: [{ googleId }, { email: normalizedEmail }],
    });

    if (existingUser) {
      // Refresh Google info (picture may have changed)
      existingUser.googleId = googleId;
      if (picture) existingUser.picture = picture;
      await existingUser.save();

      const payload = { id: existingUser._id, name: existingUser.name, email: existingUser.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

      return res.status(200).json({
        msg: "Login successful",
        user: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          picture: existingUser.picture,
        },
        token,
      });
    }

    // ── New user → issue a 10-minute pending token ──────────────────────────
    const pendingToken = jwt.sign(
      { googleId, email: normalizedEmail, name, picture, isPending: true },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.status(200).json({
      needsPassword: true,
      pendingToken,
      googleUser: { name, email: normalizedEmail, picture },
    });
  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(401).json({ error: "Google authentication failed. Invalid or expired token." });
  }
};

// ─── Step 2: Complete Google Signup (set password) ──────────────────────────
// Called after the user submits a password on the CompleteSignup page.
// Verifies the pendingToken, creates the user account with the password.
const completeGoogleSignup = async function (req, res) {
  try {
    const { pendingToken, password } = req.body;

    if (!pendingToken || !password) {
      return res.status(400).json({ error: "Pending token and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Verify the pending token (ensures Google data was legitimately obtained)
    let decoded;
    try {
      decoded = jwt.verify(pendingToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: "Session expired. Please sign in with Google again." });
    }

    if (!decoded.isPending) {
      return res.status(400).json({ error: "Invalid registration token" });
    }

    const { googleId, email, name, picture } = decoded;

    // Race-condition guard: user might have been created in another request
    const existing = await User.findOne({ $or: [{ googleId }, { email }] });
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists. Please log in." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      googleId,
      picture,
    });

    const payload = { id: user._id, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(201).json({
      msg: "Account created successfully",
      user: { id: user._id, name: user.name, email: user.email, picture: user.picture },
      token,
    });
  } catch (err) {
    console.error("Complete Google signup error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

const getMe = async function (req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      hasPassword: Boolean(user.password),
      streak: user.streak,
      longestStreak: user.longestStreak,
      totalSolved: user.totalSolved,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  completeGoogleSignup,
  getMe,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
};
