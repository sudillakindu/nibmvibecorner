# Email Setup Instructions

## Overview
This application sends confirmation emails to users after they submit their club application. The email functionality is implemented using Netlify Functions with Gmail SMTP.

## Setup Steps

### 1. Gmail Configuration

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Navigate to Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the generated password (16 characters)

### 2. Environment Variables

Add these environment variables to your Netlify deployment:

```
VITE_GMAIL_USER=your_gmail@gmail.com
VITE_GMAIL_APP_PASSWORD=your_16_character_app_password
```

### 3. Netlify Deployment

1. **Connect your repository** to Netlify
2. **Set build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
3. **Add environment variables** in Netlify dashboard:
   - Go to Site settings → Environment variables
   - Add `VITE_GMAIL_USER` and `VITE_GMAIL_APP_PASSWORD`

### 4. Local Development

For local testing, create a `.env` file in the root directory:

```env
VITE_GMAIL_USER=your_gmail@gmail.com
VITE_GMAIL_APP_PASSWORD=your_16_character_app_password
```

## How It Works

1. **User submits application** → Data is saved to Firebase
2. **Frontend calls Netlify function** → `/api/sendEmail`
3. **Netlify function sends emails**:
   - Confirmation email to user
   - Notification email to admin
4. **User receives beautiful HTML email** with club information

## Email Template

The confirmation email includes:
- Welcome message with user's name
- Application status confirmation
- Next steps information
- Upcoming events
- Contact information
- WhatsApp group link

## Troubleshooting

### Common Issues

1. **"Authentication failed" error**:
   - Check if 2FA is enabled
   - Verify app password is correct
   - Ensure Gmail account allows "less secure apps"

2. **"Function not found" error**:
   - Verify functions directory is correct in `netlify.toml`
   - Check if function is deployed to Netlify

3. **"Environment variable not found" error**:
   - Verify environment variables are set in Netlify
   - Check variable names match exactly

### Testing

1. **Test locally**:
   ```bash
   # Install dependencies
   npm install
   
   # Start the development server
   npm run dev
   
   # In another terminal, start Netlify functions locally
   npm run netlify:dev
   ```

2. **Test email sending**:
   - Submit a test application
   - Check browser console for logs
   - Verify emails are received

## Security Notes

- App passwords are more secure than regular passwords
- Environment variables are encrypted in Netlify
- Function runs server-side, keeping credentials secure
- Rate limiting is recommended for production use

## Files Structure

```
├── netlify/
│   ├── functions/
│   │   ├── sendEmail.js          # Email sending function
│   │   └── package.json          # Function dependencies
│   └── netlify.toml              # Netlify configuration
├── src/
│   ├── services/
│   │   └── emailService.ts       # Frontend email service
│   └── components/
│       └── JoinSection.tsx       # Form component
└── env.example                   # Environment variables template
``` 