# Email Configuration Troubleshooting Guide

## Problem: Nodemailer Connection Timeout (ETIMEDOUT)

This error occurs when your application cannot establish a connection to the SMTP server within the specified timeout period.

## Solutions Implemented

### 1. Enhanced Nodemailer Configuration
- **Increased timeouts**: Connection timeout set to 60 seconds
- **Retry logic**: Automatic retry with exponential backoff
- **Connection pooling**: Better resource management
- **TLS settings**: Improved security configuration

### 2. Fallback SMTP Configuration
- **Primary**: Gmail SMTP (smtp.gmail.com:587)
- **Fallback**: Alternative SMTP service (configurable via environment variables)

### 3. Improved Error Handling
- **Detailed error logging**: Specific error codes and messages
- **Graceful degradation**: Application continues even if email fails
- **Retry mechanism**: Up to 3 attempts with exponential backoff

## Environment Variables

### Required Variables
```bash
NODEMAILER_USER=your-gmail@gmail.com
NODEMAILER_PASS=your-app-password
```

### Optional Variables (for alternative SMTP)
```bash
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

### Fallback SMTP Variables
```bash
FALLBACK_SMTP_HOST=smtp.fallback-provider.com
FALLBACK_SMTP_PORT=465
FALLBACK_SMTP_USER=fallback-email@domain.com
FALLBACK_SMTP_PASS=fallback-password
```

## Common Production Issues & Solutions

### 1. Gmail App Password Issues
**Problem**: Gmail blocks login attempts from unknown locations
**Solution**: 
- Enable 2-factor authentication on your Gmail account
- Generate an App Password (not your regular password)
- Use the App Password in `NODEMAILER_PASS`

### 2. Firewall/Network Restrictions
**Problem**: Production server cannot reach Gmail SMTP
**Solution**:
- Check if port 587 is open on your server
- Verify DNS resolution for smtp.gmail.com
- Consider using alternative SMTP providers

### 3. Rate Limiting
**Problem**: Too many emails sent too quickly
**Solution**:
- Configuration includes rate limiting (5 emails per 20 seconds)
- Automatic retry with exponential backoff
- Connection pooling to manage resources

### 4. TLS/SSL Issues
**Problem**: Certificate validation failures
**Solution**:
- `tls.rejectUnauthorized: false` (for development)
- Use proper certificates in production
- Consider using port 465 with SSL instead of 587 with TLS

## Alternative SMTP Providers

If Gmail continues to cause issues, consider these alternatives:

### 1. SendGrid
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### 2. Mailgun
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

### 3. AWS SES
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-username
SMTP_PASS=your-ses-password
```

## Testing Email Configuration

### 1. Test Connection
```javascript
const { verifyConnection } = require('./config/nodeMailer');
verifyConnection().then(success => {
    console.log('Email configuration:', success ? 'Working' : 'Failed');
});
```

### 2. Test Email Sending
```javascript
const { sendMailWithRetry } = require('./config/nodeMailer');

const testEmail = {
    from: process.env.NODEMAILER_USER,
    to: 'test@example.com',
    subject: 'Test Email',
    text: 'This is a test email'
};

sendMailWithRetry(testEmail)
    .then(info => console.log('Email sent:', info.messageId))
    .catch(error => console.error('Email failed:', error));
```

## Monitoring & Debugging

### 1. Enable Detailed Logging
The configuration now includes comprehensive logging:
- Connection attempts
- Retry attempts
- Error details with specific error codes
- Success confirmations

### 2. Common Error Codes
- `ETIMEDOUT`: Connection timeout
- `EAUTH`: Authentication failed
- `ECONNREFUSED`: Connection refused
- `ENOTFOUND`: DNS resolution failed

### 3. Production Monitoring
Monitor these metrics:
- Email send success rate
- Average email send time
- Retry attempt frequency
- Connection timeout frequency

## Best Practices

### 1. Environment-Specific Configuration
- Use different SMTP providers for different environments
- Implement proper error handling for each environment
- Monitor email delivery rates

### 2. Security Considerations
- Never hardcode credentials
- Use environment variables for all sensitive data
- Rotate passwords regularly
- Use App Passwords instead of regular passwords

### 3. Performance Optimization
- Use connection pooling
- Implement rate limiting
- Monitor resource usage
- Consider email queuing for high-volume applications

## Deployment Checklist

Before deploying to production:

1. ✅ Set all required environment variables
2. ✅ Test email configuration in staging environment
3. ✅ Verify SMTP provider credentials
4. ✅ Check firewall/network restrictions
5. ✅ Monitor email delivery rates
6. ✅ Set up error alerting for email failures
7. ✅ Configure fallback SMTP if needed

## Support

If you continue to experience issues:

1. Check the application logs for specific error messages
2. Verify environment variables are set correctly
3. Test SMTP connection from your production server
4. Consider switching to a different SMTP provider
5. Contact your hosting provider about network restrictions
