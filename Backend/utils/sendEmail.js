import nodemailer from 'nodemailer';
import Leave from '../Models/leave.model.js';
import User from '../Models/user.model.js';

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

const sendLeaveNotification = async (leaveId, approvers) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email config missing - skipping notifications');
    return;
  }

  try {
    const leave = await Leave.findById(leaveId).populate('user', 'fullName designation logInID');
    if (!leave) return;

    const days = Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;
    const startDate = new Date(leave.startDate).toLocaleDateString('en-GB');
    const endDate = new Date(leave.endDate).toLocaleDateString('en-GB');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    for (const approver of approvers) {
      const mailOptions = {
        from: `"KCT Leave System" <${process.env.EMAIL_USER}>`,
        to: approver.email,
        subject: `New Leave Request - ${leave.user.fullName}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; }
    .leave-details { background: white; padding: 25px; border-radius: 10px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .status { background: #fff3cd; color: #856404; padding: 10px; border-radius: 6px; border-left: 4px solid #ffc107; }
    .btn { background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
    .footer { text-align: center; color: #666; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📄 New Leave Request</h1>
    <p>Action required from ${approver.fullName}</p>
  </div>
  
  <div class="content">
    <div class="leave-details">
      <h3>👤 Employee: ${leave.user.fullName}</h3>
      <p><strong>Designation:</strong> ${leave.user.designation}</p>
      <p><strong>📅 Dates:</strong> ${startDate} to ${endDate} (${days} days)</p>
      <p><strong>📋 Type:</strong> ${leave.leaveType}</p>
      <p><strong>📝 Reason:</strong> ${leave.reason}</p>
      ${leave.document ? '<p><strong>📎 Document:</strong> Attached</p>' : ''}
      <div class="status">
        <strong>Status: Pending Approval</strong>
      </div>
    </div>
    
    <p>Awaiting your review in the <a href="http://localhost:5173/admin" class="btn">Admin Dashboard</a></p>
  </div>
  
  <div class="footer">
    <p>KCT Leave Management System</p>
  </div>
</body>
</html>`
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Leave notification sent to ${approver.email}`);
    }
  } catch (error) {
    console.error('❌ Leave notification failed:', error.message);
  }
};

export { sendCredentialsEmail, sendLeaveNotification };

