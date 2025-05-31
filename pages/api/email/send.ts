import type { NextApiRequest, NextApiResponse } from "next"
import nodemailer from "nodemailer"
import formidable from "formidable"
// import { Crimson_Text } from "next/font/google"

export const config = {
  api: {
    bodyParser: false,
  },
}

// Update the handler function to get the recipient from the form data
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const form = formidable({ multiples: false })

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    const subject = fields.subject?.[0] || ""
    const content = fields.content?.[0] || ""
    const recipient = fields.recipient?.[0] || ""
    const attachment = files.attachment?.[0]

    if (!recipient) {
      return res.status(400).json({ error: "Recipient email is required" })
    }

    // Create a test SMTP service account
    // For production, use your actual email service credentials
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
    

    
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.SMTP_HOST,
      to: recipient,
      subject,
      html: content,
    }

    // Handle attachment if present
    if (attachment) {
      mailOptions.attachments = [
        {
          filename: attachment.originalFilename || "attachment",
          path: attachment.filepath,
        },
      ]
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("Error sending email:", error)
    return res.status(500).json({ error: "Failed to send email" })
  }
}
