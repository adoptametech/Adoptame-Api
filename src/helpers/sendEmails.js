import nodemailer from "nodemailer";
import "dotenv/config";
import { html, html2 } from "../utils/email.js";
const { APP_EMAIL, APP_PASS_EMAIL } = process.env
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: APP_EMAIL, // generated ethereal user
    pass: APP_PASS_EMAIL, // generated ethereal passwor
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  },
});


export const autoMail = async (header, toMail, subject, titulo, mensaje, button) => {

  // let button = {text: texto, link: un link}

  if (subject === undefined || !subject.length) { subject = header }
  if (titulo === undefined || !titulo.length) { titulo = header }
  await transporter.sendMail({
    from: `${header} <adoptaMe>`,
    to: toMail,
    subject: subject,
    html: html(titulo, mensaje, button),
  });
}

export const autoEmail = async (infoEmail) => {

  let {
    header,
    toMail,
    subject,
    titulo,
    mensaje,
    button = { text: undefined, link: undefined }
  } = infoEmail

  await transporter.sendMail({
    from: `${header} <adoptaMe>`,
    to: toMail,
    subject: subject ?? header,
    html: html2(titulo ?? header, mensaje, button),
  });
}