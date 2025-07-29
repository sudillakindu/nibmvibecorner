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
    const { fullName, email, studentIndexId, phone, role, status, lastLogin, lastLoginIp, isEmailVerified, profilePicture } = data;

    // Validate required fields
    if (!fullName || !email || !studentIndexId || !phone) {
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
        const whatsappData = snapshot.val();
        whatsappCommunityLink = whatsappData.whatsapp_community || whatsappCommunityLink;
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
    const templatePathConfirmationHtml = path.join(__dirname, 'emailTemplate/signupApplicationConfirmation.html');
    let confirmationHtml = fs.readFileSync(templatePathConfirmationHtml, 'utf8');
    
    confirmationHtml = confirmationHtml.replace(/\{\{fullName\}\}/g, fullName);
    confirmationHtml = confirmationHtml.replace(/\{\{email\}\}/g, email);
    confirmationHtml = confirmationHtml.replace(/\{\{studentIndexId\}\}/g, studentIndexId);
    confirmationHtml = confirmationHtml.replace(/\{\{phone\}\}/g, phone);
    confirmationHtml = confirmationHtml.replace(/\{\{status\}\}/g, status || 'pending');
    confirmationHtml = confirmationHtml.replace(/\{\{whatsappLink\}\}/g, whatsappCommunityLink);

    const confirmationMailOptions = {
      from: process.env.VITE_GMAIL_USER,
      to: email,
      subject: 'Welcome to NIBM VibeCorner Club! - Account Created Successfully',
      html: confirmationHtml,
    };

    await transporter.sendMail(confirmationMailOptions);

    // Send notification email to Notification
    const templatePathNotificationHtml = path.join(__dirname, 'emailTemplate/signupApplicationNotification.html');
    let notificationHtmlContent = fs.readFileSync(templatePathNotificationHtml, 'utf8');

    notificationHtmlContent = notificationHtmlContent.replace(/\{\{fullName\}\}/g, fullName);
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{email\}\}/g, email);
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{studentIndexId\}\}/g, studentIndexId);
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{phone\}\}/g, phone);
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{role\}\}/g, role || 'member');
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{status\}\}/g, status || 'pending');
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{lastLogin\}\}/g, lastLogin || new Date().toISOString());
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{lastLoginIp\}\}/g, lastLoginIp || 'unknown');
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{isEmailVerified\}\}/g, isEmailVerified ? 'Yes' : 'No');
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{profilePicture\}\}/g, profilePicture || 'Not uploaded');
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{timestamp\}\}/g, new Date().toLocaleString());
    notificationHtmlContent = notificationHtmlContent.replace(/\{\{webAddress\}\}/g, process.env.VITE_URL);

    const notificationMailOptions = {
      from: process.env.VITE_GMAIL_USER,
      to: process.env.VITE_ADMIN_GMAIL_USER, 
      subject: 'New User Registration - NIBM VibeCorner Club Platform',
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
        message: 'Signup confirmation emails sent successfully' 
      })
    };

  } catch (error) {
    console.error('Error sending signup emails:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to send signup emails',
        details: error.message 
      })
    };
  }
}; 