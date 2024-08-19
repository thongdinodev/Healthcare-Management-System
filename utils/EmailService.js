const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_MAILER_HOST,
        port: process.env.MAILTRAP_MAILER_PORT,
        auth: {
            user: process.env.MAILTRAP_MAILER_USER,
            pass: process.env.MAILTRAP_MAILER_PASSWORD
        }
    });

    // 2) Defined the email options
    const mailOptions = {
        from: 'Admin of Healthcare Management System <albertmoonshadow0602@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;