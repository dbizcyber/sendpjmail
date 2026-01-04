import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Autoriser uniquement POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { subject, message, imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Nettoyage base64 (PNG uniquement)
    const base64Data = imageBase64.replace(
      /^data:image\/png;base64,/,
      ""
    );

    const imageBuffer = Buffer.from(base64Data, "base64");

    // Transport SMTP (Gmail exemple)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    // Envoi du mail
    await transporter.sendMail({
      from: `"Profil altimétrique" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER, // ou autre destinataire
      subject: subject || "Profil altimétrique",
      text: message || "Voir pièce jointe",
      attachments: [
        {
          filename: "profil-altimetrique.png",
          content: imageBuffer,
          contentType: "image/png"
        }
      ]
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("MAIL ERROR:", error);
    return res.status(500).json({ error: "Mail sending failed" });
  }
}
