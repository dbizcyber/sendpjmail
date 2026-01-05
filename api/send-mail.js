import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { subject, message, imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    const base64Data = imageBase64.replace(
      /^data:image\/png;base64,/,
      ""
    );

    await resend.emails.send({
      from: "Rando <onboarding@resend.dev>", // temporaire
      to: ["lamarmotterando@gmail.com"],            // DESTINATAIRE
      subject: subject || "Profil altimétrique",
      text: message || "Voir pièce jointe",
      attachments: [
        {
          filename: "profil-altimetrique.png",
          content: base64Data
        }
      ]
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Mail sending failed" });
  }
}
