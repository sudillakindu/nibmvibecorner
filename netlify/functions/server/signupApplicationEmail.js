const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { ref, get } = require('firebase/database');
const { database } = require('../firebase/firebase');

// Embedded email templates
const signupApplicationConfirmationTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to NIBM VibeCorner Club!</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            padding: 40px;
            min-height: 100vh;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .header-bg {
            background: linear-gradient(135deg, #5C4033 0%, #8B4513 100%);
            padding: 20px 20px;
            text-align: center;
            position: relative;
        }

        .logo {
            font-size: 60px;
            font-weight: 800;
            color: #ffffff;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .logo span {
            color: #F4C430;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .welcome-text {
            font-size: 18px;
            color: #ffffff;
            font-weight: 300;
            position: relative;
            z-index: 1;
        }

        .content {
            padding: 30px 30px;
        }

        .greeting {
            font-size: 20px;
            color: #2c3e50;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .greeting strong {
            color: #5C4033;
        }

        .main-message {
            font-size: 16px;
            color: #555;
            margin-bottom: 30px;
            line-height: 1.5;
        }

        .status-card {
            background: linear-gradient(135deg, #F4C430 0%, #FFD700 100%);
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
            box-shadow: 0 8px 25px rgba(244, 196, 48, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .status-card h3 {
            color: #5C4033;
            font-size: 20px;
            margin-bottom: 10px;
            font-weight: 700;
        }

        .status-card p {
            color: #5C4033;
            font-size: 16px;
            font-weight: 500;
        }

        .account-details {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 15px 25px 15px 25px;
            margin: 30px 0;
            border-left: 4px solid #F4C430;
        }

        .account-details h3 {
            color: #5C4033;
            font-size: 18px;
            margin-bottom: 15px;
            font-weight: 700;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border-bottom: 1px solid #e9ecef;
            width: 100%;
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-label {
            font-weight: 600;
            color: #5C4033;
            font-size: 14px;
            flex: 0 0 auto;
            min-width: 120px;
        }

        .detail-value {
            color: #2c3e50;
            font-weight: 500;
            font-size: 14px;
            flex: 1;
            text-align: right;
        }

        .section {
            margin: 35px 0;
        }

        .section h3 {
            color: #5C4033;
            font-size: 20px;
            margin-bottom: 15px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section h3::before {
            content: '';
            width: 4px;
            height: 20px;
            background: linear-gradient(135deg, #F4C430 0%, #FFD700 100%);
            border-radius: 2px;
        }

        .list {
            list-style: disc;
            padding-left: 40px;
        }

        .list li {
            margin: 5px 0;
            padding: 2px 0;
            font-weight: 500;
            color: #2c3e50;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #5C4033 0%, #8B4513 100%);
            color: #ffffff !important;
            padding: 15px 30px;
            text-decoration: none !important;
            border-radius: 25px;
            font-weight: 600;
            margin: 0 auto;
            text-align: center;
            box-shadow: 0 8px 25px rgba(92, 64, 51, 0.3);
            transition: all 0.3s ease;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(92, 64, 51, 0.4);
        }

        .footer {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }

        .footer p {
            margin: 2px 0;
            font-size: 14px;
            opacity: 0.9;
        }

        .footer .tagline {
            font-size: 13px;
            font-weight: 600;
            margin-top: 5px;
            color: #F4C430;
        }

        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #F4C430 50%, transparent 100%);
            margin: 30px 0;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header-bg">
            <div class="logo">
                <span>Vibe</span>Corner
            </div>
        </div>

        <div class="content">
            <div class="greeting">
                Dear <strong>{{fullName}}</strong>,
            </div>

            <div class="main-message">
                Welcome to <strong>NIBM VibeCorner Club</strong>! Your account has been successfully created and you're now part of our vibrant community dedicated to mental freedom and creative expression.
            </div>

            <div class="status-card">
                <h3>✅ Application Received</h3>
                <p>Your application has been successfully submitted and is currently under review by our team.</p>
            </div>

            <div class="account-details">
                <h3>📋 Account Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Full Name</span>
                    <span class="detail-value">{{fullName}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">{{email}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Student ID</span>
                    <span class="detail-value">{{studentIndexId}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone</span>
                    <span class="detail-value">{{phone}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Account Status</span>
                    <span class="detail-value">{{status}}</span>
                </div>
            </div>

            <div class="section">
                <h3>📋  What's Next?</h3>
                <ul class="list">
                    <li>Our team will review your application within 24-48 hours</li>
                    <li>You'll receive an invitation to our next club meeting</li>
                    <li>Get ready to explore music, drama, and wellness activities</li>
                    <li>Connect with fellow members through our social channels</li>
                </ul>
            </div>

            <div style="text-align: center;">
                <a href="{{whatsappLink}}" class="cta-button">Join Our WhatsApp Community</a>
            </div>

            <div class="divider"></div>

            <div style="text-align: center; color: #666; font-size: 14px;">
                <p>We're excited to have you as part of our community!</p>
                <p>Stay connected and follow us on social media for updates.</p>
            </div>
        </div>

        <div class="footer">
            <p>© 2025 Stellixor Technologies. All rights reserved.</p>
            <p>NIBM VibeCorner Club Management System ✨</p>
            <p class="tagline">සන්සුන් මොහොතක්... මනසට නිදහසක්... සරසවියට ආදරයක්...</p>
        </div>
    </div>
</body>

</html>`;

const signupApplicationNotificationTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New User Registration - NIBM VibeCorner</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            padding: 40px;
            min-height: 100vh;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .header-bg {
            background: linear-gradient(135deg, #5C4033 0%, #8B4513 100%);
            padding: 20px 20px;
            text-align: center;
            position: relative;
        }

        .logo {
            font-size: 60px;
            font-weight: 800;
            color: #ffffff;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .logo span {
            color: #F4C430;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .notification-text {
            font-size: 18px;
            color: #ffffff;
            font-weight: 300;
            position: relative;
            z-index: 1;
        }

        .content {
            padding: 30px 30px;
        }

        .greeting {
            font-size: 20px;
            color: #2c3e50;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .greeting strong {
            color: #5C4033;
        }

        .main-message {
            font-size: 16px;
            color: #555;
            margin-bottom: 30px;
            line-height: 1.5;
        }

        .registration-card {
            background: linear-gradient(135deg, #F4C430 0%, #FFD700 100%);
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
            box-shadow: 0 8px 25px rgba(244, 196, 48, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .registration-card h3 {
            color: #5C4033;
            font-size: 20px;
            margin-bottom: 10px;
            font-weight: 700;
        }

        .registration-card p {
            color: #5C4033;
            font-size: 16px;
            font-weight: 500;
        }

        .section {
            margin: 35px 0;
        }

        .section h3 {
            color: #5C4033;
            font-size: 20px;
            margin-bottom: 15px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section h3::before {
            content: '';
            width: 4px;
            height: 20px;
            background: linear-gradient(135deg, #F4C430 0%, #FFD700 100%);
            border-radius: 2px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }

        .info-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #F4C430;
        }

        .info-label {
            font-weight: 600;
            color: #5C4033;
            font-size: 14px;
            margin-bottom: 5px;
        }

        .info-value {
            color: #2c3e50;
            font-size: 16px;
            font-weight: 500;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #5C4033 0%, #8B4513 100%);
            color: #ffffff !important;
            padding: 15px 30px;
            text-decoration: none !important;
            border-radius: 25px;
            font-weight: 600;
            margin: 0 auto;
            text-align: center;
            box-shadow: 0 8px 25px rgba(92, 64, 51, 0.3);
            transition: all 0.3s ease;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(92, 64, 51, 0.4);
        }

        .footer {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }

        .footer p {
            margin: 2px 0;
            font-size: 14px;
            opacity: 0.9;
        }

        .footer .tagline {
            font-size: 13px;
            font-weight: 600;
            margin-top: 5px;
            color: #F4C430;
        }

        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #F4C430 50%, transparent 100%);
            margin: 30px 0;
        }

        .timestamp {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin: 20px 0;
            font-style: italic;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header-bg">
            <div class="logo">
                <span>Vibe</span>Corner
            </div>
            <div class="notification-text">New User Registration</div>
        </div>

        <div class="content">
            <div class="greeting">
                Hello <strong>Admin</strong>,
            </div>

            <div class="main-message">
                A new user has registered on the <strong>NIBM VibeCorner Club</strong> platform. Please review the registration details below.
            </div>

            <div class="registration-card">
                <h3>👤 New User Registration</h3>
                <p>Registration completed at {{timestamp}}</p>
            </div>

            <div class="section">
                <h3>📋 User Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Full Name</div>
                        <div class="info-value">{{fullName}}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email Address</div>
                        <div class="info-value">{{email}}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Student Index ID</div>
                        <div class="info-value">{{studentIndexId}}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Phone Number</div>
                        <div class="info-value">{{phone}}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">User Role</div>
                        <div class="info-value">{{role}}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Account Status</div>
                        <div class="info-value">{{status}}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email Verified</div>
                        <div class="info-value">{{isEmailVerified}}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Profile Picture</div>
                        <div class="info-value">{{profilePicture}}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h3>🔍 Account Activity</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Last Login</div>
                        <div class="info-value">{{lastLogin}}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Last Login IP</div>
                        <div class="info-value">{{lastLoginIp}}</div>
                    </div>
                </div>
            </div>

            <div class="timestamp">
                Registration completed on: {{timestamp}}
            </div>

            <div style="text-align: center;">
                <a href="{{webAddress}}" class="cta-button">View User Details</a>
            </div>

            <div class="divider"></div>

            <div style="text-align: center; color: #666; font-size: 14px;">
                <p>Please review this registration and take appropriate action if needed.</p>
                <p>You can approve, reject, or request additional information.</p>
            </div>
        </div>

        <div class="footer">
            <p>© 2025 Stellixor Technologies. All rights reserved.</p>
            <p>NIBM VibeCorner Club Management System ✨</p>
            <p class="tagline">සන්සුන් මොහොතක්... මනසට නිදහසක්... සරසවියට ආදරයක්...</p>
        </div>
    </div>
</body>

</html>`;

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
    //   console.error('Error fetching WhatsApp community link:', error);
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
    const confirmationHtml = signupApplicationConfirmationTemplate
      .replace(/\{\{fullName\}\}/g, fullName)
      .replace(/\{\{email\}\}/g, email)
      .replace(/\{\{studentIndexId\}\}/g, studentIndexId)
      .replace(/\{\{phone\}\}/g, phone)
      .replace(/\{\{status\}\}/g, status || 'pending')
      .replace(/\{\{whatsappLink\}\}/g, whatsappCommunityLink);

    const confirmationMailOptions = {
      from: process.env.VITE_GMAIL_USER,
      to: email,
      subject: 'Welcome to NIBM VibeCorner Club! - Account Created Successfully',
      html: confirmationHtml,
    };

    await transporter.sendMail(confirmationMailOptions);

    // Send notification email to Notification
    const notificationHtmlContent = signupApplicationNotificationTemplate
      .replace(/\{\{fullName\}\}/g, fullName)
      .replace(/\{\{email\}\}/g, email)
      .replace(/\{\{studentIndexId\}\}/g, studentIndexId)
      .replace(/\{\{phone\}\}/g, phone)
      .replace(/\{\{role\}\}/g, role || 'member')
      .replace(/\{\{status\}\}/g, status || 'pending')
      .replace(/\{\{lastLogin\}\}/g, lastLogin || new Date().toISOString())
      .replace(/\{\{lastLoginIp\}\}/g, lastLoginIp || 'unknown')
      .replace(/\{\{isEmailVerified\}\}/g, isEmailVerified ? 'Yes' : 'No')
      .replace(/\{\{profilePicture\}\}/g, profilePicture || 'Not uploaded')
      .replace(/\{\{timestamp\}\}/g, new Date().toLocaleString())
      .replace(/\{\{webAddress\}\}/g, process.env.VITE_URL);

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
    // console.error('Error sending signup emails:', error);
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