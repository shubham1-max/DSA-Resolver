const https = require("https");

/**
 * Send an OTP verification email using Brevo's HTTP API (Port 443)
 * This entirely bypasses Railway's outbound SMTP block on ports 465/587.
 * 
 * @param {string} to - The recipient's email address
 * @param {string} otp - The 6-digit OTP code
 */
const sendVerificationEmail = (to, otp) => {
  return new Promise((resolve) => {
    if (!process.env.BREVO_API_KEY) {
      console.warn("[EmailService] BREVO_API_KEY missing. Cannot send HTTP email.");
      return resolve(false);
    }

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

    const data = JSON.stringify({
      sender: { 
        email: process.env.EMAIL_USER || "noreply@dsa-resolver.com", 
        name: "DSA Resolver" 
      },
      to: [{ email: to }],
      subject: "Your DSA Resolver Verification Code",
      htmlContent: htmlContent
    });

    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log("[EmailService] Verification email sent successfully via HTTPS API");
          resolve(true);
        } else {
          console.error("[EmailService] HTTP API Error:", res.statusCode, responseBody);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.error("[EmailService] Error sending email via HTTPS API:", error);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
};

module.exports = {
  sendVerificationEmail,
};
