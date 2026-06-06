import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

// Modern HTML Template for Admin Notification
const generateAdminEmailHtml = (data: any) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fb; margin: 0; padding: 20px; color: #041d3c; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(4,29,60,0.05); }
    .header { background-color: #041d3c; padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px; }
    .content { padding: 30px; }
    .content h2 { font-size: 20px; color: #041d3c; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #f4f7fb; padding-bottom: 10px; }
    .detail-table { w-full; border-collapse: collapse; }
    .detail-table th { text-align: left; padding: 12px 0; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f4f7fb; width: 40%; }
    .detail-table td { padding: 12px 0; color: #041d3c; font-size: 15px; font-weight: 500; border-bottom: 1px solid #f4f7fb; }
    .message-box { background-color: #f8fafc; border-left: 4px solid #1a84ff; padding: 15px; margin-top: 20px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #4b5563; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; background-color: #f8fafc; border-top: 1px solid #f4f7fb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Quote Request</h1>
    </div>
    <div class="content">
      <h2>Inquiry Details</h2>
      <table class="detail-table" width="100%">
        <tr><th>Package</th><td>${data.packageTitle}</td></tr>
        <tr><th>Customer Name</th><td>${data.firstName} ${data.surname}</td></tr>
        <tr><th>Email</th><td><a href="mailto:${data.email}" style="color: #1a84ff; text-decoration: none;">${data.email}</a></td></tr>
        <tr><th>Phone</th><td>${data.phone}</td></tr>
        <tr><th>Country Code</th><td>${data.country}</td></tr>
        <tr><th>Travel Date</th><td>${data.travelDate || data.checkIn || 'Not specified'}</td></tr>
        <tr><th>Duration</th><td>${data.nights} Nights</td></tr>
        <tr><th>Guests</th><td>${data.adults} Adults, ${data.children} Children, ${data.infants} Infants</td></tr>
        ${data.roomType ? `<tr><th>Room Type</th><td>${data.roomType}</td></tr>` : ''}
      </table>
      ${(data.message || data.details) ? `
      <div style="margin-top: 30px;">
        <h3 style="font-size: 14px; text-transform: uppercase; color: #6b7280; margin-bottom: 10px;">Special Requests / Message</h3>
        <div class="message-box">${data.message || data.details}</div>
      </div>` : ''}
    </div>
    <div class="footer">
      Simplifly Finland • Automated Inquiry System
    </div>
  </div>
</body>
</html>
`;

// Modern HTML Template for Customer Confirmation
const generateCustomerEmailHtml = (data: any) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fb; margin: 0; padding: 20px; color: #041d3c; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(4,29,60,0.05); }
    .header { background-color: #1a84ff; padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 1px; }
    .header p { color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 16px; }
    .content { padding: 40px 30px; text-align: left; }
    .content p { font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 20px; }
    .package-card { background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-top: 20px; }
    .package-card h3 { margin-top: 0; color: #041d3c; font-size: 18px; margin-bottom: 10px; }
    .package-card p { margin: 0; font-size: 14px; color: #6b7280; }
    .btn { display: inline-block; background-color: #041d3c; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 14px; margin-top: 30px; }
    .footer { text-align: center; padding: 30px 20px; font-size: 13px; color: #9ca3af; background-color: #f8fafc; border-top: 1px solid #f4f7fb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Simplifly Finland</h1>
      <p>Your journey begins here.</p>
    </div>
    <div class="content">
      <p>Hi <strong>${data.firstName}</strong>,</p>
      <p>Thank you for reaching out! We have successfully received your request for a quote. Our travel experts are reviewing your details and <strong>we will contact you quickly</strong> with a customized itinerary and pricing.</p>
      
      <div class="package-card">
        <h3>${data.packageTitle}</h3>
        <p><strong>Travel Date:</strong> ${data.travelDate || data.checkIn || 'Flexible'}</p>
        <p><strong>Guests:</strong> ${data.adults} Adults, ${data.children} Children, ${data.infants} Infants</p>
        <p><strong>Duration:</strong> ${data.nights} Nights</p>
        ${data.roomType ? `<p><strong>Room Type:</strong> ${data.roomType}</p>` : ''}
      </div>

      <div style="margin-top: 40px; padding: 20px; background-color: #f4f7fb; border-radius: 8px; border-left: 4px solid #1a84ff;">
        <h4 style="margin-top: 0; color: #041d3c; margin-bottom: 10px;">Our Contact Details</h4>
        <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.5;">
          <strong>Email:</strong> sales@simpliflyfinland.fi<br/>
          <strong>Phone:</strong> +358 40 819 2758<br/>
          <strong>Address:</strong> Kardinaalinkatu 4C 20, 20540, Turku, Finland
        </p>
      </div>

      <center>
        <a href="https://simpliflyfinland.com" class="btn">Explore More Destinations</a>
      </center>
    </div>
    <div class="footer">
      <p>Need immediate assistance? Reply directly to this email or call us at our contact number.</p>
      <p>&copy; ${new Date().getFullYear()} Simplifly Finland. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const submitInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    // Basic server-side validation
    if (!data.firstName || !data.email || !data.packageTitle) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Configure nodemailer transport
    // Note: The user should define SMTP_USER and SMTP_PASS in the .env file
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email to Admin
    const adminMailOptions = {
      from: `"Simplifly Finland System" <${process.env.SMTP_USER}>`,
      to: 'nirmalgayantha55@gmail.com',
      subject: `New Inquiry: ${data.packageTitle} from ${data.firstName} ${data.surname}`,
      html: generateAdminEmailHtml(data),
      replyTo: data.email,
    };

    // Email to Customer
    const customerMailOptions = {
      from: `"Simplifly Finland" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: `We received your inquiry for ${data.packageTitle}!`,
      html: generateCustomerEmailHtml(data),
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    res.status(200).json({ message: 'Inquiry submitted successfully' });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ error: 'Failed to process inquiry' });
  }
};
