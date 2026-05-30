import nodemailer from 'nodemailer';

// Gmail SMTP using an App Password (not the normal account password).
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const port = Number(process.env.SMTP_PORT || 587);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465, // 465 = implicit TLS, 587 = STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

export async function sendMail({ subject, html, replyTo, to }) {
  const t = getTransporter();
  const recipient = to || process.env.CONTACT_TO || process.env.SMTP_USER;
  const from = process.env.SMTP_FROM
    || `"${process.env.NEXT_PUBLIC_SITE_NAME || 'Website'}" <${process.env.SMTP_USER}>`;
  return t.sendMail({ from, to: recipient, subject, html, replyTo });
}
