const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Add verification check
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Verification Error:", error);
    console.error("Full error details:", JSON.stringify(error, null, 2));
  } else {
    console.log("Server is ready");
  }
});

const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: {
        name: "Kuwait Fitness",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2c3e50; text-align: center;">Email Verification</h1>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p style="font-size: 16px;">Your OTP for email verification is:</p>
            <h2 style="color: #e74c3c; text-align: center; font-size: 32px; letter-spacing: 5px;">${otp}</h2>
            <p style="color: #7f8c8d; font-size: 14px;">This OTP will expire in 5 minutes.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Send mail error:", error);
    return false;
  }
};

const sendVerificationEmail = async (email, verificationUrl) => {
  try {
    console.log("Starting email send process...");
    console.log("Email configuration:", {
      from: process.env.EMAIL_USER,
      to: email,
      verificationUrl: verificationUrl,
    });

    const mailOptions = {
      from: {
        name: "Kuwait Fitness",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Email Verification",
      text: `Please verify your email by clicking this link: ${verificationUrl}`,
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2c3e50; text-align: center;">Verify Your Email</h1>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
              <p style="font-size: 16px;">Please click the button below to verify your email address:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #2ecc71; 
                          color: white; 
                          padding: 12px 30px; 
                          text-decoration: none; 
                          border-radius: 5px; 
                          font-weight: bold;">
                  Verify Email
                </a>
              </div>
              <p style="color: #7f8c8d; font-size: 14px;">This link will expire in 24 hours.</p>
            </div>
          </div>
        `,
    };

    console.log("Attempting to send email...");
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Full response:", JSON.stringify(info, null, 2));

    return true;
  } catch (error) {
    console.error("Email Send Error:");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Full error details:", JSON.stringify(error, null, 2));
    return false;
  }
};

const sendContactFormEmail = async (contactData) => {
  const { firstName, lastName, email, phone, message } = contactData;

  const mailOptions = {
    from: {
      name: `${firstName} ${lastName}`,
      address: email,
    },
    to: "aaalenezi217@gmail.com", // Your email address
    subject: "New Contact Form Submission",
    html: `
     <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333333; margin: 0; padding: 20px 0; border-bottom: 2px solid #f0f0f0;">Kuwait Fitness - Contact Form</h1>
        </div>
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333333; margin-bottom: 20px;">New Message Details</h2>
          <div style="margin-bottom: 20px;">
            <p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 8px 0;">
              <strong style="color: #333333;">From:</strong> ${firstName} ${lastName}
            </p>
            <p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 8px 0;">
              <strong style="color: #333333;">Email:</strong> ${email}
            </p>
            <p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 8px 0;">
              <strong style="color: #333333;">Phone:</strong> ${phone}
            </p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 6px; margin-top: 20px;">
            <h3 style="color: #333333; margin-bottom: 10px;">Message:</h3>
            <p style="color: #555555; font-size: 16px; line-height: 1.6;">${message}</p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #f0f0f0;">
          <p style="color: #999999; font-size: 12px;">© ${new Date().getFullYear()} Kuwait Fitness. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending contact form email:", error);
    throw error;
  }
};

module.exports = { sendOTPEmail, sendVerificationEmail, sendContactFormEmail };
