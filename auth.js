// auth.js

const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2("636730519513-hilqquh1a4818ip66h6j0sn5j53p12bk.apps.googleusercontent.com", "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", "https://developers.google.com/oauthplayground");

const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

const url = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: GMAIL_SCOPES,
});

console.log('Authorize this app by visiting this url:', url);