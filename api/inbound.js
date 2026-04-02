const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
const FORWARD_TO = "ben@katsuracreative.com";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { from, to, subject, text, html } = req.body;

    await resend.emails.send({
      from: "forwarded@atlantarainbowfamilies.com",
      to: FORWARD_TO,
      subject: `[Fwd] ${subject || "(no subject)"}`,
      text: `Forwarded from: ${from}\nTo: ${to}\n\n${text || ""}`,
      html: html
        ? `<p><strong>Forwarded from:</strong> ${from}<br><strong>To:</strong> ${to}</p><hr>${html}`
        : undefined,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email forwarding error:", error);
    return res.status(500).json({ error: "Failed to forward email" });
  }
};
