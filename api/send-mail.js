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

 const { subject, message, imageBase64, emailUtilisateur } = req.body;

await resend.emails.send({
  from: "Profil altimétrique <contact@lamarmottechateaurenard.com>",
  to: ["contact@lamarmottechateaurenard.com"],
  bcc: [
    "lamarmotterando@gmail.com",
    ...(emailUtilisateur ? [emailUtilisateur] : [])
  ],
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
if (emailUtilisateur && !emailUtilisateur.includes("@")) {
  return res.status(400).json({ error: "Invalid email" });
}


    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("RESEND ERROR:", error);
    return res.status(500).json({ error: "Mail sending failed" });
  }
}
