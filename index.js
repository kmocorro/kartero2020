const {json} = require('micro');
const nodemailer = require('nodemailer');
const config = require('./config').config;

module.exports = async (req, res) => {
    const js = await (json(req));
    const transporter = nodemailer.createTransport(config.mail);
    const attachments_array = [];

    if(js.attachments.length > 0) {
        for(let i=0;i<js.attachments.length;i++){
            attachments_array.push({
                filename: js.attachments[i].filename,
                path: js.attachments[i].path
            })
        }
    }

    /** In order to attach file in email, ssh through the server, move the file you want to attach to "~App/kartero/static/" and use its filename in curl or POST request. */

    /**
     * How to send an email to this kartero2020:
     * -> 
     *      curl -d '{"sender": "META Team", "subject":"Your new Automailer, Kartero.", "recipient_email":["kevin.mocorro@sunpowercorp.com", "Elmer.Malazarte@sunpowercorp.com"], "filename":"file.txt", "attachments":[{"filename":"file.txt", "path": "./static/file.txt"}, {"filename":"file2.txt", "path": "./static/file2.txt"}, {"filename":"file3.txt", "path":"./static/file3.txt"}], "message":"This is a sample message... \n please feel free to say hi"}' -H "Content-Type: application/json" -X POST http://10.3.10.209:3004/
     * 
     */

    const mailSetup = {
        from:  js.sender + ' <f4automailer@maxeon.com>',
        to: js.recipient_email,
        subject: js.subject,
        text: js.message,
        attachments: attachments_array
    }

    transporter.sendMail(mailSetup, (err, info) => {
        if(err){ return res.end(err + ' error sending email.') }
        res.end('Successfully sent to ' + info.accepted);
    })
}