var express = require("express");
var router = express.Router();

var jsonParser = require("body-parser").json();
var nodemailer = require("nodemailer");
// var hbs = require("nodemailer-express-handlebars");
// var transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     auth: {
//         user: 'visadanang.vn@gmail.com',
//         password: 'vfl@12345'
//     }
// })
// transporter.use('compile', hbs({
//     viewPath: 'apps/views/mail-templates',
//     extName: 'ejs'
// }))


router.get("/", function(req, res){
    // res.send("Welcome to NodeMailer!");
    res.render('nodemailer');
})


router.post("/testmail", jsonParser, (req, res) => {
    // res.send(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var title = req.body.title;
    var content = req.body.content;

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.email',
        // port: 465,
        // secure: true, // true for 465, false for other ports
        auth: {
            user: 'visadanang.vn@gmail.com', // generated ethereal user
            pass: 'vfl@12345' // generated ethereal password
        }
    });

    let mailOptions = {
        from: '"VISADANANG.VN" <visadanang.vn@gmail.com>', // sender address
        // to: 'bar@example.com, baz@example.com', // list of receivers
        to: email,
        subject: 'Hello', // Subject line
        text: 'Hello ' + name, // plain text body
        html: '<b>Hello, this is test email content! </b>' // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.json({"mess": "fail", "err": error});
            return console.log(error);
        }
        res.json({"mess": "ok", "info": info.response});
        console.log('Message sent: ', info.response);
    });
})

module.exports = router;