const nodemailer = require("nodemailer");
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

// Create a reusable transporter using the default SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Extremely important for Railway: Force IPv4 to prevent ENETUNREACH on IPv6
    family: 4,
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};

/**
 * Send an OTP verification email
 * @param {string} to - The recipient's email address
 * @param {string} otp - The 6-digit OTP code
 */
const sendVerificationEmail = async (to, otp) => {
  try {
    const transporter = createTransporter();
    
    // HTML email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Welcome to DSA Resolver! Please use the verification code below to complete your registration.
        </p>
        <div style="background-color: #f4f4f5; border-radius: 6px; padding: 16px; text-align: center; margin: 24px 0;">
          <h1 style="margin: 0; color: #111827; letter-spacing: 4px;">${otp}</h1>
        </div>
        <p style="color: #555; font-size: 14px;">
          This code will expire in 10 minutes. If you did not request this, please ignore this email.
        </p>
      </div>
    `;

    const mailOptions = {
      from: `"DSA Resolver" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your DSA Resolver Verification Code",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("[EmailService] Verification email sent to: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("[EmailService] Error sending email:", error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
};
