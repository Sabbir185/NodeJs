const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');


module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Sabbir Ahmmed<${process.env.FROM_EMAIL}>`;
    };

    newTransport() {
        if(process.env.NODE_ENV === 'production') {
            // SendGrid
            return 1;
        };

        return nodemailer.createTransport({
            // service: 'Gmail',
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASS
            }
        });
    };

    // send the actual email
    send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        }

        // 3) Create a transport and send email
        this.newTransport().sendMail(mailOptions);
    }

    sendWelcome() {
        this.send('Welcome', 'Welcome to the Natours family!');
    }
};









/*
    const sendEmail = async options => {
        // 1) Create a transporter
        const transporter = nodemailer.createTransport({
            // service: 'Gmail',
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASS
            }
        })

        // 2) Define the options
        const mailOptions = {
            from: 'Sabbir Ahmmed <sabbir@gmail.com>',
            to: options.email,
            subject: options.subject,
            text: options.message
        }

        // 3) Actually send the email
        await transporter.sendMail(mailOptions);
    }

    module.exports = sendEmail

*/