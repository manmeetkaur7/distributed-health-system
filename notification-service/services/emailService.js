const nodemailer = require('nodemailer');

const emailConfigComplete = () => {
  return Boolean(
    process.env.EMAIL_HOST &&
      process.env.EMAIL_PORT &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      process.env.ALERT_EMAIL_TO
  );
};

const sendHighRiskEmail = async ({ userId, message, riskLevel }) => {
  if (!emailConfigComplete()) {
    return { skipped: true, reason: 'Email settings are not configured' };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: process.env.ALERT_EMAIL_TO,
    subject: 'High health risk alert',
    text: [
      message,
      '',
      `User ID: ${userId}`,
      `Risk Level: ${riskLevel}`,
    ].join('\n'),
  });

  return { skipped: false };
};

module.exports = { sendHighRiskEmail };
