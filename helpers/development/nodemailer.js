const nodemailer = require('nodemailer')

function sendEmail(to, subject, body) {
    console.log(to, subject, body)
    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth: {
            user: "nsamuderahack@gmail.com",
            pass: process.env.email_pass
        }
    });
    const mailOptions = {
        from: 'The Blog Team"nsamuderahack@gmail.com"',
        to: to,
        subject: subject,
        generateTextFromHTML: true,
        html: body
    };

    smtpTransport.sendMail(mailOptions, (error, response) => {
        if (error) {
            console.log(error)
        } else {
            console.log('email sent', response)
        }
    });
}

module.exports = sendEmail