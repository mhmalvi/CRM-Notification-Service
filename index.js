const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const Vonage = require("@vonage/server-sdk");
const SMS = require("@vonage/server-sdk/lib/Messages/SMS.js");

const vonage = new Vonage({
  apiKey: process.env.VONAGE_APIKEY,
  apiSecret: process.env.VONAGE_APISECRET,
});
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const server = http.createServer(app);

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crm-system",
  multipleStatements: true,
});

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Connected !!!");

  socket.on("send-notification", function (data) {
    io.emit("new-notification", data);
  });

  socket.on("disconnect", function () {
    console.log("Disconnected");
  });
});


app.post("/send-email", async (req, res) => {
  const sendMail = async () => {
    const { email } = req.body;

    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    // let transporter = nodemailer.createTransport({
    //   host: "smtp.ethereal.email",
    //   port: 587,
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: testAccount.user,
    //     pass: testAccount.pass,
    //   },
    //   logger: true,
    //   debug: true,
    // });

    let transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // let info = await transporter.sendMail({
    //   from: '"Fred Foo 👻" <foo@example.com>', // sender address
    //   to: "sourav@quadque.digital", // list of receivers
    //   subject: "Hello ✔", // Subject line
    //   text: "Hello world?", // plain text body
    //   html: "<b>Hello world?</b>", // html body
    // });

    const mailOptions = {
      from: "sender@gmail.com", // Sender address
      to: "souravsengpt@gmail.com", // List of recipients
      subject: "Node Mailer", // Subject line
      text: "Hello People!, Welcome to Bacancy!", // Plain text body
    };

    transport.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
        res.send("Email Sent!");
      }
    });

    // send mail with defined transport object
    // console.log("Message sent: %s", info.messageId);

    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  };

  sendMail().catch(console.error);
});


app.post("/send-sms", async (req, res) => {
  const { text, number } = req.body;
  console.log(text, number);

  vonage.messages.send(new SMS(text, number, "CRM"), (err, data) => {
    if (err) {
      console.error("Message failed with error:", err);
    } else {
      console.log(`Message ${data.message_uuid} sent successfully.`);
      res.json("Message Sent");
    }
  });
});

// app.post("/send-sms", async (req, res) => {
//   const text = "Vai message sent";

//   vonage.messages.send(new SMS(text, "+8801756414858", "CRM"), (err, data) => {
//     if (err) {
//       console.error("Message failed with error:", err);
//     } else {
//       console.log(`Message ${data.message_uuid} sent successfully.`);
//     }
//   });
// });

app.get("/", (req, res) => {
  res.json(`Notification Server is running`);
});

server.listen(5000 || process.env.PORT, () => {
  console.log(
    `Notification Server is running at http://localhost:${process.env.PORT}`
  );
});
