const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (toEmail, otp) => {
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: toEmail,
        subject: 'Your Password Reset OTP - Finance Tracker',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; background: #f9fafb; border-radius: 8px;">
                <h2 style="color: #6366f1;">Finance Tracker</h2>
                <p>You requested a password reset. Use the OTP below:</p>
                <div style="text-align: center; margin: 24px 0;">
                    <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #6366f1;">${otp}</span>
                </div>
                <p style="color: #9ca3af; font-size: 14px;">This OTP expires in <strong>15 minutes</strong>. If you didn't request this, ignore this email.</p>
            </div>
        `
    });
};

module.exports = { sendOtpEmail };
