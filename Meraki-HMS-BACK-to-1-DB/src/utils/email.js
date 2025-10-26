// src/utils/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false, // ✅ important for Gmail on port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendCancellationEmail(to, patientName, doctorName, hospitalName, date, slotStart, slotEnd) {
  if (!to) return; // no email to send

  const subject = `Appointment Cancelled — ${hospitalName || ""}`;
  const text = `Dear ${patientName || "Patient"},\n\n` +
    `Your appointment with Dr. ${doctorName || ""} on ${date} at ${slotStart} - ${slotEnd} has been cancelled due to doctor's unavailability.\n\n` +
    `Please contact the hospital or use the booking portal to reschedule. We apologize for the inconvenience.\n\n` +
    `Regards,\n${hospitalName || "Hospital"}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || "no-reply@meraki-hms.com",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Failed to send cancellation email:", err);
    return false;
  }
}

/**
 * ✅ Sends admin credentials email when a new admin is registered
 */
async function sendAdminCredentialsEmail(to, adminName, email, password, hospitalName, hospitalId) {
  if (!to) return false;

  const subject = `Your Admin Account Credentials - ${hospitalName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="color: #2d89ef;">Welcome to ${hospitalName}</h2>
      <p>Hello <strong>${adminName}</strong>,</p>
      <p>Your <strong>Admin Account</strong> has been created successfully. Below are your login details:</p>
      <ul>
        <li><strong>Login Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
        <li><strong>Hospital ID:</strong> ${hospitalId}</li>
      </ul>
      <p>You can log in using the following link:</p>
      <p style="margin-top:20px;">⚠️ Please change your password after your first login for security purposes.</p>
      <p>Regards,<br/>Hospital Management System</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || "no-reply@meraki-hms.com",
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Credentials email sent to ${to}`);
    return true;
  } catch (err) {
    console.error("❌ Failed to send admin credentials email:", err);
    return false;
  }
}


/**
 * ✅ Sends doctor credentials email when a new doctor is registered
 */
async function sendDoctorCredentialsEmail(to, doctorName, email, password, hospitalName, hospitalId, specialization) {
  if (!to) return false;

  const subject = `Your Doctor Account - ${hospitalName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="color:#2d89ef;">Welcome to ${hospitalName}</h2>
      <p>Hello Dr. <strong>${doctorName}</strong>,</p>
      <p>Your doctor account has been successfully created for <strong>${hospitalName}</strong>.</p>

      <h3>🔐 Login Credentials</h3>
      <ul>
        <li><strong>Login Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
        <li><strong>Hospital ID:</strong> ${hospitalId}</li>
      </ul>

      <h3>👨‍⚕️ Doctor Details</h3>
      <ul>
        <li><strong>Specialization:</strong> ${specialization}</li>
      </ul>
      <p style="margin-top:20px;">⚠️ Please change your password after first login.</p>
      <p>Regards,<br/>Hospital Management System</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || "no-reply@meraki-hms.com",
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Doctor credentials email sent to ${to}`);
    return true;
  } catch (err) {
    console.error("❌ Failed to send doctor credentials email:", err);
    return false;
  }
}

/**
 * ✅ Sends receptionist credentials email when a new receptionist is registered
 */
async function sendReceptionistCredentialsEmail(to, name, email, password, hospitalName, hospitalId, mobile) {
  if (!to) return false;

  const subject = `Your Receptionist Account - ${hospitalName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="color:#2d89ef;">Welcome to ${hospitalName}</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your <strong>Receptionist Account</strong> has been successfully created for <strong>${hospitalName}</strong>.</p>

      <h3>🔐 Login Credentials</h3>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
        <li><strong>Hospital ID:</strong> ${hospitalId}</li>
        <li><strong>Mobile:</strong> ${mobile || "N/A"}</li>
      </ul>

      <p style="margin-top:20px;">⚠️ Please change your password after your first login for security.</p>
      <p>Regards,<br/>Hospital Management System</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || "no-reply@meraki-hms.com",
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Receptionist credentials email sent to ${to}`);
    return true;
  } catch (err) {
    console.error("❌ Failed to send receptionist credentials email:", err);
    return false;
  }
}

console.log("SMTP Config:", process.env.SMTP_HOST, process.env.SMTP_USER, process.env.SMTP_PASS);


module.exports = { sendCancellationEmail, sendAdminCredentialsEmail, sendDoctorCredentialsEmail ,sendReceptionistCredentialsEmail};
