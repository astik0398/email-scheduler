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
  logger: true,
  debug: true,
});

// Sample task list
const tasks = []; // For project-related tasks
const detailedTasks = []; // For individual tasks with descriptions

// Function to send email for project tasks
const sendEmail = (email, taskName, dueDate) => {
  console.log(`Preparing to send email to: ${email}`);

  const dateOnly = new Date(dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mailOptions = {
    from: 'amazingrandomfaqs@gmail.com',
    to: email,
    subject: `Reminder: Task "${taskName}" is Due`,
    text: `Hi, just a reminder that the task "${taskName}" is due on ${dateOnly}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email to ${email}:`, error);
    } else {
      console.log(`Email sent to ${email}:`, info.response);
    }
  });
};

// Function to send email for detailed tasks
const sendDetailedEmail = (email, taskName, description, dueDate) => {
  console.log(`Preparing to send email to: ${email}`);

  const dateOnly = new Date(dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mailOptions = {
    from: 'amazingrandomfaqs@gmail.com',
    to: email,
    subject: `Reminder: Task "${taskName}" is Due`,
    text: `Hi, just a reminder that the task "${taskName}" is due on ${dateOnly}.\n\nTask Description: ${description}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email to ${email}:`, error);
    } else {
      console.log(`Email sent to ${email}:`, info.response);
    }
  });
};

// Cron job to check for due project tasks every 2 minutes
cron.schedule('*/2 * * * *', () => {
  console.log('Running cron job to check for due project tasks...');
  const now = new Date();

  tasks.forEach((task) => {
    const dueDate = new Date(task.dueDate);

    if (!task.reminder) {
      console.log(`Reminder is disabled for task "${task.taskName}". Skipping...`);
      return;
    }

    // Check if the task is due now or in the last minute
    if (dueDate > new Date(now - 60000)) {
      console.log(`Sending email for task "${task.taskName}"...`);
      sendEmail(task.email, task.taskName, task.dueDate);
    }
  });
});

// Cron job to check for due detailed tasks every 2 minutes
cron.schedule('*/2 * * * *', () => {
  console.log('Running cron job for detailed tasks...');
  const now = new Date();

  detailedTasks.forEach((task) => {
    const dueDate = new Date(task.dueDate);

    if (!task.reminder) {
      console.log(`Reminder is disabled for task "${task.taskName}". Skipping...`);
      return;
    }

    // Check if the task is due now or in the last minute
    if (dueDate > new Date(now - 60000)) {
      console.log(`Sending email for detailed task "${task.taskName}"...`);
      sendDetailedEmail(task.email, task.taskName, task.description, task.dueDate);
    }
  });
});

// Endpoint to manually send a reminder for project tasks
app.post('/send-reminder', (req, res) => {
  const { email, taskName, dueDate, reminder } = req.body;

  const taskIndex = tasks.findIndex((task) => task.taskName === taskName);
  if (taskIndex > -1) {
    tasks[taskIndex] = { email, taskName, dueDate, reminder };
  } else {
    tasks.push({ email, taskName, dueDate, reminder });
  }

  if (!email || !taskName || !dueDate) {
    return res.status(400).send('Missing required fields: email, taskName, dueDate');
  }

  const dateOnly = new Date(dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (reminder) {
    const mailOptions = {
      from: 'amazingrandomfaqs@gmail.com',
      to: email,
      subject: `Reminder: Task "${taskName}" Due`,
      text: `Hi, just a reminder that the task "${taskName}" is due on ${dateOnly}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending email');
      }

      console.log(`Reminder sent to ${email}:`, info.response);
      return res.status(200).send('Reminder sent');
    });
  } else {
    console.log(`Reminder disabled for task "${taskName}".`);
    return res.status(200).send('Reminder updated but not sent (disabled).');
  }
});

// Endpoint to add a new individual task reminder with description
app.post('/each-task-reminder', (req, res) => {
  const { email, taskName, description, dueDate, reminder } = req.body;

  if (!email || !taskName || !description || !dueDate) {
    return res.status(400).send('Missing required fields: email, taskName, description, dueDate');
  }

  const newTask = { email, taskName, description, dueDate, reminder };

  // Add the task to the detailedTasks list
  const taskIndex = detailedTasks.findIndex((task) => task.taskName === taskName);
  if (taskIndex > -1) {
    detailedTasks[taskIndex] = newTask;
  } else {
    detailedTasks.push(newTask);
  }

  if (reminder) {
    const dateOnly = new Date(dueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const mailOptions = {
      from: 'amazingrandomfaqs@gmail.com',
      to: email,
      subject: `Reminder: Task "${taskName}" Due`,
      text: `Hi, just a reminder that the task "${taskName}" is due on ${dateOnly}.\n\nTask Description: ${description}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending email');
      }

      console.log(`Reminder sent to ${email}:`, info.response);
      return res.status(200).send('Reminder sent and task scheduled');
    });
  } else {
    console.log(`Reminder disabled for task "${taskName}".`);
    return res.status(200).send('Task added without immediate reminder (reminder disabled).');
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
