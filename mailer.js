const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "s3.silveira@gmail.com",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
  },
});

const sendEmail = async (emailOptions) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

module.exports = transport;
