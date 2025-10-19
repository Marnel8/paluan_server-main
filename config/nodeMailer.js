const nodemailer = require("nodemailer");

// Create a transporter with enhanced configuration for production
const createTransporter = () => {
    // Primary Gmail configuration
    const gmailConfig = {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.NODEMAILER_USER, // Your Gmail address
            pass: process.env.NODEMAILER_PASS, // Your generated app password
        },
        // Enhanced connection settings for production
        connectionTimeout: 60000, // 60 seconds
        greetingTimeout: 30000, // 30 seconds
        socketTimeout: 60000, // 60 seconds
        // Retry settings
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 20000, // 20 seconds
        rateLimit: 5, // max 5 emails per rateDelta
        // TLS settings
        tls: {
            rejectUnauthorized: false
        }
    };

    // Alternative SMTP configuration for production environments
    const alternativeConfig = {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER || process.env.NODEMAILER_USER,
            pass: process.env.SMTP_PASS || process.env.NODEMAILER_PASS,
        },
        connectionTimeout: 60000,
        greetingTimeout: 30000,
        socketTimeout: 60000,
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 20000,
        rateLimit: 5,
        tls: {
            rejectUnauthorized: false
        }
    };

    // Use alternative config if SMTP_HOST is set, otherwise use Gmail
    const config = process.env.SMTP_HOST ? alternativeConfig : gmailConfig;
    
    return nodemailer.createTransporter(config);
};

const transporter = createTransporter();

// Enhanced verification with retry logic
const verifyConnection = async () => {
    try {
        await transporter.verify();
        console.log("✅ Nodemailer is ready to send emails");
        return true;
    } catch (error) {
        console.error("❌ Nodemailer configuration error:", error);
        
        // Log specific error details for debugging
        if (error.code === 'ETIMEDOUT') {
            console.error("Connection timeout - check network connectivity and firewall settings");
        } else if (error.code === 'EAUTH') {
            console.error("Authentication failed - check NODEMAILER_USER and NODEMAILER_PASS environment variables");
        } else if (error.code === 'ECONNREFUSED') {
            console.error("Connection refused - check if Gmail SMTP is accessible from your server");
        }
        
        return false;
    }
};

// Verify connection on startup
verifyConnection();

// Create a fallback transporter for critical failures
const createFallbackTransporter = () => {
    // Use a different SMTP service as fallback (e.g., SendGrid, Mailgun, etc.)
    const fallbackConfig = {
        host: process.env.FALLBACK_SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.FALLBACK_SMTP_PORT) || 465,
        secure: true,
        auth: {
            user: process.env.FALLBACK_SMTP_USER || process.env.NODEMAILER_USER,
            pass: process.env.FALLBACK_SMTP_PASS || process.env.NODEMAILER_PASS,
        },
        connectionTimeout: 30000,
        greetingTimeout: 15000,
        socketTimeout: 30000,
    };
    
    return nodemailer.createTransporter(fallbackConfig);
};

// Enhanced sendMail function with retry logic and fallback
const sendMailWithRetry = async (mailOptions, maxRetries = 3) => {
    let currentTransporter = transporter;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`📧 Attempting to send email (attempt ${attempt}/${maxRetries})`);
            const info = await currentTransporter.sendMail(mailOptions);
            console.log("✅ Email sent successfully:", info.messageId);
            return info;
        } catch (error) {
            console.error(`❌ Email send attempt ${attempt} failed:`, error.message);
            
            // If this is the last attempt and we haven't tried fallback yet, try fallback
            if (attempt === maxRetries && currentTransporter === transporter) {
                console.log("🔄 Trying fallback SMTP configuration...");
                currentTransporter = createFallbackTransporter();
                attempt = 0; // Reset attempt counter for fallback
                maxRetries = 2; // Give fallback 2 attempts
                continue;
            }
            
            if (attempt === maxRetries) {
                throw new Error(`Failed to send email after ${maxRetries} attempts: ${error.message}`);
            }
            
            // Wait before retry (exponential backoff)
            const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
            console.log(`⏳ Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

module.exports = {
    transporter,
    sendMailWithRetry,
    verifyConnection
};