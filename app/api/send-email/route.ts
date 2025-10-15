// app/api/send-email/route.ts
import nodemailer from 'nodemailer';

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'digitivaa@gmail.com',
    pass: 'aoqa gsal cmgn qcym',
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const toEmail = 'digitivaa@gmail.com';
    const imageFile = formData.get('image') as File | null;

    if (!name?.trim()) {
      return Response.json(
        { success: false, message: 'Please enter your name' },
        { status: 400 }
      );
    }

    // Convert the image file to a buffer
    let attachments = [];
    if (imageFile) {
      const imageBytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(imageBytes);
      
      attachments.push({
        filename: 'handwritten-message.png',
        content: buffer,
        cid: 'handwritten-message',
        encoding: 'base64'
      });
    }

    // Send mail
    const info = await transporter.sendMail({
      from: '"Engagement Website" <digitivaa@gmail.com>',
      to: toEmail,
      subject: `New Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">You've received a new message!</h2>
          <p><strong>From:</strong> ${name}</p>
          <p>Here's the handwritten message:</p>
          ${imageFile ? 
            `<div style="margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 8px;">
              <img src="cid:handwritten-message" alt="Handwritten message" style="max-width: 100%; height: auto;" />
            </div>` : 
            '<p>No image was attached to this message.</p>'
          }
        </div>
      `,
      attachments
    });

    return Response.json({ 
      success: true, 
      message: 'Message sent successfully!',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json(
      { 
        success: false, 
        message: 'Failed to send message. Please try again later.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}