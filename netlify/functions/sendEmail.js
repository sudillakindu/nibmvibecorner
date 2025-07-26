const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, email, faculty, year, interests, message } = data;

    // Validate required fields
    if (!name || !email || !faculty || !year || !interests) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Create transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.VITE_GMAIL_USER,
        pass: process.env.VITE_GMAIL_APP_PASSWORD,
      },
    });

    // Email template for confirmation
    const confirmationHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Liberate!</title>
          <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2c3e50; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; min-height: 100vh; }
              .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
              .header-bg { background: linear-gradient(135deg, #5C4033 0%, #8B4513 100%); padding: 30px 30px; text-align: center; position: relative; }
              .logo { font-size: 40px; font-weight: 800; color: #ffffff; margin-bottom: 10px; position: relative; z-index: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
              .logo span { color: #F4C430; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
              .welcome-text { font-size: 18px; color: #ffffff; font-weight: 300; position: relative; z-index: 1; }
              .content { padding: 40px 30px; }
              .greeting { font-size: 20px; color: #2c3e50; margin-bottom: 25px; font-weight: 600; }
              .greeting strong { color: #5C4033; }
              .main-message { font-size: 16px; color: #555; margin-bottom: 30px; line-height: 1.7; }
              .status-card { background: linear-gradient(135deg, #F4C430 0%, #FFD700 100%); border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center; box-shadow: 0 8px 25px rgba(244, 196, 48, 0.3); border: 2px solid rgba(255,255,255,0.2); }
              .status-card h3 { color: #5C4033; font-size: 20px; margin-bottom: 10px; font-weight: 700; }
              .status-card p { color: #5C4033; font-size: 16px; font-weight: 500; }
              .section { margin: 35px 0; }
              .section h3 { color: #5C4033; font-size: 20px; margin-bottom: 15px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
              .section h3::before { content: ''; width: 4px; height: 20px; background: linear-gradient(135deg, #F4C430 0%, #FFD700 100%); border-radius: 2px; }
              .list { list-style: none; padding-left: 0; }
              .list li { background: #f8f9fa; margin: 10px 0; padding: 15px 20px; border-radius: 8px; border-left: 4px solid #F4C430; font-weight: 500; color: #2c3e50; transition: all 0.3s ease; }
              .list li:hover { background: #fff3cd; transform: translateX(5px); }
              .contact-card { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #dee2e6; }
              .contact-card h4 { color: #5C4033; font-size: 18px; margin-bottom: 15px; font-weight: 700; }
              .contact-item { display: flex; align-items: center; margin: 12px 0; font-size: 15px; color: #555; }
              .contact-item .icon { width: 20px; margin-right: 12px; font-size: 16px; }
              .cta-button { display: inline-block; background: linear-gradient(135deg, #5C4033 0%, #8B4513 100%); color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 25px 0; text-align: center; box-shadow: 0 8px 25px rgba(92, 64, 51, 0.3); transition: all 0.3s ease; }
              .cta-button:hover { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(92, 64, 51, 0.4); }
              .footer { background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: #ffffff; text-align: center; padding: 30px; }
              .footer p { margin: 5px 0; font-size: 14px; opacity: 0.9; }
              .footer .tagline { font-size: 16px; font-weight: 600; margin-top: 15px; color: #F4C430; }
              .divider { height: 1px; background: linear-gradient(90deg, transparent 0%, #F4C430 50%, transparent 100%); margin: 30px 0; }
              @media (max-width: 600px) { .email-container { margin: 10px; border-radius: 12px; } .header-bg, .content { padding: 20px 20px; } .logo { font-size: 28px; } .welcome-text { font-size: 16px; } }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header-bg">
                  <div class="logo">
                      <span>Libe</span>rate
                  </div>
              </div>
              
              <div class="content">
                  <div class="greeting">
                      Dear <strong>${name}</strong>,
                  </div>
                  
                  <div class="main-message">
                      Thank you for joining <strong>Liberate</strong>! We're thrilled to welcome you to our vibrant community dedicated to mental freedom and creative expression. Your journey with us is about to begin!
                  </div>
                  
                  <div class="status-card">
                      <h3>✅ Application Received</h3>
                      <p>Your application has been successfully submitted and is currently under review by our team.</p>
                  </div>
                  
                  <div class="section">
                      <h3>📋 What's Next?</h3>
                      <ul class="list">
                          <li>Our team will review your application within 24-48 hours</li>
                          <li>You'll receive an invitation to our next club meeting</li>
                          <li>Get ready to explore music, drama, and wellness activities</li>
                          <li>Connect with fellow members through our social channels</li>
                      </ul>
                  </div>
                  
                  <div class="section">
                      <h3>🎯 Upcoming Events</h3>
                      <ul class="list">
                          <li>🎵 Open Mic Night - Every Friday at 7:00 PM</li>
                          <li>🎭 Drama Workshops - Every Saturday at 10:00 AM</li>
                          <li>🧘 Meditation Sessions - Every Sunday at 9:00 AM</li>
                          <li>🎨 Creative Arts & Crafts - Every Wednesday at 4:00 PM</li>
                      </ul>
                  </div>
                  
                  <div class="contact-card">
                      <h4>📞 Need to reach us?</h4>
                      <div class="contact-item">
                          <span class="icon">📧</span>
                          <span>Email: info@liberate.edu</span>
                      </div>
                      <div class="contact-item">
                          <span class="icon">📱</span>
                          <span>WhatsApp: +94 123 456 789</span>
                      </div>
                      <div class="contact-item">
                          <span class="icon">📍</span>
                          <span>Location: Student Union Building, Room 204</span>
                      </div>
                      <div class="contact-item">
                          <span class="icon">🌐</span>
                          <span>Website: www.liberate.edu</span>
                      </div>
                  </div>
                  
                  <div style="text-align: center;">
                      <a href="#" class="cta-button">Join Our WhatsApp Group</a>
                  </div>
                  
                  <div class="divider"></div>
                  
                  <div style="text-align: center; color: #666; font-size: 14px;">
                      <p>We can't wait to see you at our next event!</p>
                      <p>Stay connected and follow us on social media for updates.</p>
                  </div>
              </div>
              
              <div class="footer">
                  <p>© 2025 Stellixor Technologies. All rights reserved.</p>
                  <p>Building friendships that last a lifetime ✨</p>
                  <p class="tagline">Empowering minds, liberating creativity</p>
              </div>
          </div>
      </body>
      </html>
    `;

    // Send confirmation email to user
    const confirmationMailOptions = {
      from: process.env.VITE_GMAIL_USER,
      to: email,
      subject: 'Welcome to Liberate! - Application Confirmation',
      html: confirmationHtml,
    };

    await transporter.sendMail(confirmationMailOptions);

    // Send notification email to admin
    const adminHtmlContent = `
      <h2>New Club Application Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Faculty:</strong> ${faculty}</p>
      <p><strong>Year:</strong> ${year}</p>
      <p><strong>Interests:</strong> ${interests.join(', ')}</p>
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    `;

    const adminMailOptions = {
      from: process.env.VITE_GMAIL_USER,
      to: process.env.VITE_GMAIL_USER, // Send to admin email
      subject: 'New Liberate Club Application',
      html: adminHtmlContent,
    };

    await transporter.sendMail(adminMailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Emails sent successfully' 
      })
    };

  } catch (error) {
    console.error('Error sending emails:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send emails',
        details: error.message 
      })
    };
  }
}; 