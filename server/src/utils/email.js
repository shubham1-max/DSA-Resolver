/**
 * Send an OTP verification email using Brevo's HTTP API (Port 443)
 * This entirely bypasses Railway's outbound SMTP block on ports 465/587.
 * 
 * @param {string} to - The recipient's email address
 * @param {string} otp - The 6-digit OTP code
 */
const sendVerificationEmail = async (to, otp) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.warn("[EmailService] BREVO_API_KEY missing. Cannot send HTTP email.");
      return false;
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

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { 
          email: process.env.EMAIL_USER || "noreply@dsa-resolver.com", 
          name: "DSA Resolver" 
        },
        to: [{ email: to }],
        subject: "Your DSA Resolver Verification Code",
        htmlContent: htmlContent
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[EmailService] HTTP API Error:", errorData);
      return false;
    }

    console.log("[EmailService] Verification email sent successfully via HTTP API");
    return true;
  } catch (error) {
    console.error("[EmailService] Error sending email via HTTP API:", error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
};
