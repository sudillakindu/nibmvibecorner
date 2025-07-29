const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { ref, get } = require('firebase/database');
const { database } = require('../firebase/firebase');

// Embedded email templates
const clubApplicationConfirmationTemplate = `<!DOCTYPE html>
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
            /* Ensure white color */
            padding: 15px 30px;
            text-decoration: none !important;
            /* Remove underline */
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
                Dear <strong>{{name}}</strong>,
            </div>

            <div class="main-message">
                Thank you for joining <strong>NIBM VibeCorner Club</strong>! We're thrilled to welcome you to our vibrant community
                dedicated to mental freedom and creative expression. Your journey with us is about to begin!
            </div>

            <div class="status-card">
                <h3>✅ Application Received</h3>
                <p>Your application has been successfully submitted and is currently under review by our team.</p>
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
                <p>We can't wait to see you at our next event!</p>
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

const clubApplicationNotificationTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New NIBM VibeCorner Club Application</title>
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
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .logo span {
            color: #F4C430;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
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
        
        .application-card {
            background: linear-gradient(135deg, #F4C430 0%, #FFD700 100%);
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            box-shadow: 0 8px 25px rgba(244, 196, 48, 0.3);
            border: 2px solid rgba(255,255,255,0.2);
        }
        
        .application-card h3 {
            color: #5C4033;
            font-size: 25px;
            margin-bottom: 20px;
            font-weight: 700;
            text-align: center;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 10px;
        }
        
        .info-item {
            background: rgba(255, 255, 255, 0.9);
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #5C4033;
        }
        
        .info-item strong {
            color: #5C4033;
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .info-item span {
            color: #2c3e50;
            font-weight: 500;
        }
        
        /* Enhanced Table Styles */
        .application-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            margin: 15px 0;
            background: #ffffff;
            table-layout: fixed;
        }
        
        .application-table th {
            background: linear-gradient(135deg, #5C4033 0%, #8B4513 100%);
            color: #ffffff;
            padding: 10px 15px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: none;
            position: relative;
        }
        
        .application-table th:first-child {
            width: 33.33%;
        }
        
        .application-table th:last-child {
            width: 66.67%;
        }
        
        .application-table th:first-child {
            border-top-left-radius: 12px;
        }
        
        .application-table th:last-child {
            border-top-right-radius: 12px;
        }
        
        .application-table td {
            padding: 8px 15px;
            border: none;
            border-bottom: 1px solid #e9ecef;
            color: #2c3e50;
            font-weight: 500;
            font-size: 14px;
            background: #ffffff;
            transition: background-color 0.3s ease;
        }
        
        .application-table td:first-child {
            width: 33.33%;
        }
        
        .application-table td:last-child {
            width: 66.67%;
        }
        
        .application-table tr:nth-child(even) td {
            background: #f8f9fa;
        }
        
        .application-table tr:hover td {
            background: #f1f3f4;
        }
        
        .application-table tr:last-child td {
            border-bottom: none;
        }
        
        .application-table tr:last-child td:first-child {
            border-bottom-left-radius: 12px;
        }
        
        .application-table tr:last-child td:last-child {
            border-bottom-right-radius: 12px;
        }
        
        .table-label {
            font-weight: 600;
            color: #5C4033;
            min-width: 120px;
        }
        
        .table-value {
            color: #2c3e50;
            word-break: break-word;
        }
        
        .interests-section {
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 8px;
            margin-top: 15px;
        }
        
        .interests-section strong {
            color: #5C4033;
            display: block;
            margin-bottom: 10px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .interests-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .interest-tag {
            background: #5C4033;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .message-section {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #F4C430;
        }
        
        .message-section strong {
            color: #5C4033;
            display: block;
            margin-bottom: 10px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .timestamp {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .action-buttons {
            text-align: center;
            margin: 30px 0 0 0;
        }
        
        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #5C4033 0%, #8B4513 100%);
            color: #ffffff !important;
            padding: 12px 25px;
            text-decoration: none !important;
            border-radius: 25px;
            font-weight: 600;
            margin: 0 10px;
            font-size: 14px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(92, 64, 51, 0.3);
            transition: all 0.3s ease;
        }
        
        .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(92, 64, 51, 0.4);
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
                Hello <strong>Admin</strong>,
            </div>
            
            <div class="main-message">
                A new application has been submitted to join the NIBM VibeCorner Club. Please review the details below and take appropriate action.
            </div>
            
            <div class="application-card">
                <h3>📋 Application Details</h3>
                
                <table class="application-table">
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="table-label">👤 Name</td>
                      <td class="table-value">{{name}}</td>
                    </tr>
                    <tr>
                      <td class="table-label">📧 Email</td>
                      <td class="table-value">{{email}}</td>
                    </tr>
                    <tr>
                      <td class="table-label">🆔 Student ID</td>
                      <td class="table-value">{{studentIndexId}}</td>
                    </tr>
                    <tr>
                      <td class="table-label">🎓 Faculty</td>
                      <td class="table-value">{{faculty}}</td>
                    </tr>
                    <tr>
                      <td class="table-label">📅 Year</td>
                      <td class="table-value">{{year}}</td>
                    </tr>
                    <tr>
                      <td class="table-label">🎯 Interests</td>
                      <td class="table-value">{{interests}}</td>
                    </tr>
                  </tbody>
                </table>
                
                <div class="message-section">
                    <strong>Additional Message</strong>
                    <p>{{messageSection}}</p>
                </div>

            </div>
            
            <div class="timestamp">
                <strong>Application Submitted:</strong> {{timestamp}}
            </div>
            
            <div class="action-buttons">
                <a href="mailto:{{email}}" class="action-button">Reply to Applicant</a>
                <a href="{{webAddress}}/dashboard" class="action-button">View Dashboard</a>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2025 Stellixor Technologies. All rights reserved.</p>
            <p>NIBM VibeCorner Club Management System ✨</p>
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
        const confirmationHtml = clubApplicationConfirmationTemplate.replace(/\{\{name\}\}/g, name).replace(/\{\{whatsappLink\}\}/g, whatsappCommunityLink);

        const confirmationMailOptions = {
            from: process.env.VITE_GMAIL_USER,
            to: email,
            subject: 'Welcome to NIBM VibeCorner Club! - Application Confirmation',
            html: confirmationHtml,
        };

        await transporter.sendMail(confirmationMailOptions);

        // Send notification email to Notification
        const notificationHtmlContent = clubApplicationNotificationTemplate
            .replace(/\{\{name\}\}/g, name)
            .replace(/\{\{email\}\}/g, email)
            .replace(/\{\{studentIndexId\}\}/g, studentIndexId)
            .replace(/\{\{faculty\}\}/g, faculty)
            .replace(/\{\{year\}\}/g, year)
            .replace(/\{\{interests\}\}/g, interests.join(', '))
            .replace(/\{\{messageSection\}\}/g, message || '')
            .replace(/\{\{timestamp\}\}/g, new Date().toLocaleString())
            .replace(/\{\{webAddress\}\}/g, process.env.VITE_URL);

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
        // console.error('Error sending emails:', error);
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