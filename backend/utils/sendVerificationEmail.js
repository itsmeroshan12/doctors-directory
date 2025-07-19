const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT == '465', // true for 465, false for others like 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      logger: true,  // Enable logs for debugging SMTP
      debug: true,
    });

    // const verificationUrl = `${process.env.FRONTEND_URL}/api/user/verify-email?token=${token}`;
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;


    const mailOptions = {
      from: `"Doctor Directory" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Please verify your email for Doctor Directory',
      html: `
        <h2>Welcome to Doctor Directory</h2>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}" target="_blank" rel="noopener noreferrer">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Verification email sent to ${email}`);
    console.log('Message ID:', info.messageId);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

module.exports = { sendVerificationEmail };
