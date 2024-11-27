const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config();

const app = express();

const cors = require('cors');
app.use(cors());
app.use(express.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'amazingrandomfaqs@gmail.com', // Replace with your email
    pass: 'veld cesm tqqu nuvb',        // Replace with your app password
  },
  logger: true, // Log SMTP transactions
  debug: true,  // Enable debug output
});

// Sample task list
const tasks = [
  // { email: 'kumarastik0398@gmail.com', taskName: 'Submit Report', dueDate: '2024-11-30 02:44:00' },
];

// Function to send email
const sendEmail = (email, taskName, dueDate) => {
  console.log(`Preparing to send email to: ${email}`);
  const mailOptions = {
    from: 'amazingrandomfaqs@gmail.com',
    to: email,
    subject: `Reminder: Task "${taskName}" Due`,
    text: `Hi, just a reminder that the task "${taskName}" is due on ${dueDate}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email to ${email}:`, error);
    } else {
      console.log(`Email sent to ${email}:`, info.response);
    }
  });
};

// Cron job to check for due tasks every minute
cron.schedule('*/15 * * * *', () => {
  console.log('Running cron job to check for due tasks...');
  const now = new Date();
console.log('current time', now);

  tasks.forEach((task) => {
    const dueDate = new Date(task.dueDate);
    console.log(`Now: ${now}, Task "${task.taskName}" Due Date: ${dueDate}`);

    // Check if the task is due now or in the last minute
    if (dueDate > new Date(now - 60000)) {
      console.log(`Sending email for task "${task.taskName}"...`);
      sendEmail(task.email, task.taskName, task.dueDate);
    }
  });
});

// Endpoint to manually send a reminder
app.post('/send-reminder', (req, res) => {
  const { email, taskName, dueDate } = req.body;

  tasks.push({ email, taskName, dueDate });
  
  if (!email || !taskName || !dueDate) {
    return res.status(400).send('Missing required fields: email, taskName, dueDate');
  }

  const mailOptions = {
    from: 'amazingrandomfaqs@gmail.com',
    to: email,
    subject: `Reminder: Task "${taskName}" Due`,
    text: `Hi, just a reminder that the task "${taskName}" is due on ${dueDate}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    }

    console.log(`Reminder sent to ${email}:`, info.response);
    res.status(200).send('Reminder sent');
  });
});

// Endpoint to add a new task
app.post('/add-task', (req, res) => {
  const { email, taskName, dueDate } = req.body;

  if (!email || !taskName || !dueDate) {
    return res.status(400).send('Missing required fields: email, taskName, dueDate');
  }

  tasks.push({ email, taskName, dueDate });
  res.status(201).send('Task added successfully');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
