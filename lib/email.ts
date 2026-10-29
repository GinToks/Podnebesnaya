export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Поднебесная <noreply@podnebesnaya.vercel.app>";

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[email] RESEND_API_KEY not set. Would send to", to, "subject:", subject);
      console.info("[email] HTML:", html);
    }
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html, text }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("[email] Resend error:", err);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[email] send failed:", e);
    return false;
  }
}

export function verificationEmailHtml(link: string, email: string) {
  return `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #F0F5EC; color: #3D2B1F;">
      <h1 style="font-weight: 300; letter-spacing: 0.1em;">Поднебесная</h1>
      <p>Здравствуйте!</p>
      <p>Вы зарегистрировались на сайте Поднебесная с email <strong>${email}</strong>.</p>
      <p>Чтобы подтвердить адрес, нажмите на кнопку:</p>
      <p style="text-align: center; margin: 32px 0;">
        <a href="${link}" style="display: inline-block; padding: 12px 28px; background: #6B8A5E; color: #fff; text-decoration: none; border-radius: 8px;">Подтвердить email</a>
      </p>
      <p style="font-size: 12px; color: #6B6B6B;">Если вы не регистрировались, просто проигнорируйте это письмо.</p>
      <p style="font-size: 12px; color: #6B6B6B;">Ссылка: ${link}</p>
    </div>
  `;
}
