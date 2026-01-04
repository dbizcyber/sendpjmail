import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { sujet, message, image } = req.body;

  const base64 = image.replace(/^data:image\/jpeg;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  await transporter.sendMail({
    from: "La Marmotte <noreply@lamarmottechateaurenard.com>",
    to: "contact@lamarmottechateaurenard.com",
    bcc: [
      "lamarmotterando@gmail.com",
      "fibre13160@gmail.com"
    ],
    subject: sujet,
    text: message,
    attachments: [
      {
        filename: "profil-altimetrique.jpg",
        content: buffer,
        contentType: "image/jpeg"
      }
    ]
  });

  res.status(200).json({ success: true });
}
