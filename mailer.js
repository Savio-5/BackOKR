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

module.exports = transport;

// async function sendEmail() {
//   try {
    

//     const mailOptions = {
//         from:"s3.silveira@gmail.com",
//         to:"mca.2225@unigoa.ac.in",
//         subject:"Test email",
//         text:"Sent from Node.js",
//         html:"<h1>Hello World</h1>"
//     }

//     const result = await transport.sendMail(mailOptions)

//     return result

//   } catch (error) {
//     console.log(error);
//   }
// }

// sendEmail()
// .then((result) => {
//     console.log("Email has been sent")
// })
// .catch((error) => {
//     console.log(`An ${error} occured`)
// })

// module.exports = sendEmail;