const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { ref, get } = require('firebase/database');
const { database } = require('../firebase/firebase');

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, email, studentIndexId, faculty, year, interests, message } = data;

    // Validate required fields
    if (!name || !email || !studentIndexId || !faculty || !year || !interests) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Fetch WhatsApp community link from Firebase
    let whatsappCommunityLink = ''; // Default fallback
    try {
      const whatsappRef = ref(database, 'whatsapp/community_whatsapp');
      const snapshot = await get(whatsappRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        whatsappCommunityLink = data.whatsapp_community || whatsappCommunityLink;
      }
    } catch (error) {
      console.error('Error fetching WhatsApp community link:', error);
      // Continue with default link if Firebase fails
    }

    // Create transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.VITE_GMAIL_USER,
        pass: process.env.VITE_GMAIL_APP_PASSWORD,
      },
    });

    // Read and process the confirmation email template
    const templatePathConfirmationHtml = path.join(__dirname, 'emailTemplate/clubApplicationConfirmation.html');
    let confirmationHtml = fs.readFileSync(templatePathConfirmationHtml, 'utf8');
    
    confirmationHtml = confirmationHtml.replace(/\{\{name\}\}/g, name);
    confirmationHtml = confirmationHtml.replace(/\{\{whatsappLink\}\}/g, whatsappCommunityLink);

    const confirmationMailOptions = {
      from: process.env.VITE_GMAIL_USER,
      to: email,
      subject: 'Welcome to NIBM VibeCorner Club! - Application Confirmation',
      html: confirmationHtml,
    };

    await transporter.sendMail(confirmationMailOptions);

    // Send notification email to Notification
    const templatePathNotificationHtml = path.join(__dirname, 'emailTemplate/clubApplicationNotification.html');
    let notificationHtmlContent = fs.readFileSync(templatePathNotificationHtml, 'utf8');

    notificationHtmlContent = notificationHtmlContent.replace(/\{\{name\}\}/g, name);
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{email\}\}/g, email);
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{studentIndexId\}\}/g, studentIndexId);
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{faculty\}\}/g, faculty);
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{year\}\}/g, year);
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{interests\}\}/g, interests.join(', '));
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{messageSection\}\}/g, message || '');
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{timestamp\}\}/g, new Date().toLocaleString());
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{webAddress\}\}/g, process.env.VITE_URL);

    const notificationMailOptions = {
      from: process.env.VITE_GMAIL_USER,
      to: process.env.VITE_ADMIN_GMAIL_USER, 
      subject: 'New NIBM VibeCorner Club Application',
      html: notificationHtmlContent,
    };

    await transporter.sendMail(notificationMailOptions);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Emails sent successfully' 
      })
    };

  } catch (error) {
    console.error('Error sending emails:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to send emails',
        details: error.message 
      })
    };
  }
}; 