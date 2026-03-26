import nodemailer from "nodemailer";

interface SendMailParams {
  smtpEmail: string;
  smtpPassword: string;
  to: string;
  subject: string;
  body: string;
}

export async function sendEmailToBlogger({
  smtpEmail,
  smtpPassword,
  to,
  subject,
  body,
}: SendMailParams) {
  // Create transporter for Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpEmail,
      pass: smtpPassword,
    },
  });

  const mailOptions = {
    from: smtpEmail,
    to: to,
    subject: subject,
    html: body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}
