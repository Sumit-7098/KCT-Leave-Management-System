import nodemailer from 'nodemailer';

const sendCredentialsEmail = async (email, logInID, logInPassword, fullName) => {
  // Check required env vars
  if (!`sumitkumarverma742@gmail.com` || !`zgeuptrofhdbwjer`) {
    console.log('Email config missing - skipping email. Add EMAIL_USER/EMAIL_PASS to .env');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `sumitkumarverma742@gmail.com`,
      pass: `zgeuptrofhdbwjer`
    }
  });

  const mailOptions = {
    from: `"KCT Leave System" <${`sumitkumarverma742@gmail.com`}>`,
    to: email,
    subject: 'Welcome to KCT Leave Management - Login Credentials',
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2354A2 0%, #1e4486 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; margin-top: 20px; }
    .credentials { background: white; padding: 20px; border-radius: 8px; border-left: 5px solid #2354A2; margin: 20px 0; }
    .btn { background: #2354A2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 Welcome ${fullName}!</h1>
    <p>Your KCT Leave Management account is ready</p>
  </div>
  
  <div class="content">
    <h2>Your Login Credentials</h2>
    <div class="credentials">
      <p><strong>👤 Login ID:</strong></p>
      <p style="font-size: 18px; font-weight: bold; color: #2354A2; margin: 5px 0;">${logInID}</p>
      
      <p><strong>🔑 Password:</strong></p>
      <p style="font-size: 18px; font-weight: bold; color: #e74c3c; margin: 5px 0; letter-spacing: 1px;">${logInPassword}</p>
    </div>
    
    <a href="http://localhost:5173/login" class="btn" style="color: #fff">Login Now →</a>
    <p style="color: #666; font-style: italic;">Please change your password after first login</p>
  </div>
  
  <div class="footer">
    <p>KCT Leave Management System</p>
    <p>If you didn't create this account, ignore this email</p>
  </div>
</body>
</html>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    // Don't throw - signup continues
  }
};

export default sendCredentialsEmail;

