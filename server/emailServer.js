// Simple email server using Gmail
// Run this separately: node server/emailServer.js

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json());

// Gmail configuration
// You'll need to:
// 1. Enable 2-factor authentication on your Gmail account
// 2. Generate an "App Password" (Google Account > Security > App passwords)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your Gmail
    pass: 'your-app-password', // Replace with your Gmail App Password (16 characters)
  },
});

app.post('/api/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    const info = await transporter.sendMail({
      from: '"MedSpa Opus" <your-email@gmail.com>', // Replace with your Gmail
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Email server running on http://localhost:${PORT}`);
});
