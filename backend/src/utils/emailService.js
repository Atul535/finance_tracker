const { toNamespacedPath } = require('node:path');
const nodemailer = require('nodemailer');

//create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOtpEmail = async (toEmail,otp) => {
    await transporter.sendMail({
        from: `'Finance Tracker <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Reset Your Password',
        html:  `
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