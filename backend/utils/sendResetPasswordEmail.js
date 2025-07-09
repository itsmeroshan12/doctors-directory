const nodemailer = require('nodemailer');

const sendResetPasswordEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,  // corrected here
      port: process.env.SMTP_PORT,  // corrected here
      secure: false, // true for 465, false for other ports like 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/user/reset-password/${token}`;

    const mailOptions = {
      from: `"Doctor Directory" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password - Doctor Directory',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw error;
  }
};

module.exports = { sendResetPasswordEmail };
  