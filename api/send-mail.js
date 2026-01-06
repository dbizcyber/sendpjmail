import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ✅ UNE SEULE déstructuration
    const { subject, message, imageBase64, emailUtilisateur } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    // ✅ validation email AVANT envoi
    if (emailUtilisateur && !emailUtilisateur.includes("@")) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const base64Data = imageBase64.replace(
      /^data:image\/png;base64,/,
      ""
    );

    await resend.emails.send({
      from: "Profil altimétrique <contact@lamarmottechateaurenard.com>",
      to: ["contact@lamarmottechateaurenard.com"],
      cc: emailUtilisateur ? [emailUtilisateur] : [],
      bcc: ["lamarmotterando@gmail.com"],
      subject: subject || "Profil altimétrique",
      text: message || "Voir pièce jointe",
      attachments: [
        {
          filename: "profil-altimetrique.png",
          content: base64Data,
          encoding: "base64"
        }
      ]
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("RESEND ERROR:", error);
    return res.status(500).json({ error: "Mail sending failed" });
  }
}

