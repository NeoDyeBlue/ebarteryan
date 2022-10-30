/**
 * utility function for sending emails
 *
 * @see {@link https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a | Sending Emails Securely Using Node.js, Nodemailer, SMTP, Gmail, and OAuth2}
 */

import { google } from "googleapis";
import nodemailer from "nodemailer";
//  const smtpConfig = require("../../config/smtp.config");
const OAuth2 = google.auth.OAuth2; // Google OAuth2 instead of using Less Secure App

/**
 * Creates a transporter to send emails
 */

async function createTransporter() {
  try {
    const oauth2Client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject("Failed to create access token");
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SRVC,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
      accessToken,
    });

    return transporter;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * Sends an email
 * @param {string} from - the sender of the email
 * @param {string} to - the receiver of the email
 * @param {string} subject - what is it for
 * @param {string} text - email body in text form
 * @param {*} html - the html for the email
 */

export async function sendEmail(from, to, subject, text, html) {
  try {
    const transporter = await createTransporter();

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    throw error;
  }
}
