export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface ResendErrorBody {
  message?: string;
  name?: string;
  statusCode?: number;
}

/**
 * Resend (like every reputable email provider) requires the `from` address to
 * use a domain that has been verified in the Resend dashboard. Shared hosting
 * domains such as `*.vercel.app` are NOT accepted, so we must never fall back
 * to them as a sender.
 */
function isVerifiableHost(host: string): boolean {
  if (!host) return false;
  const h = host.toLowerCase().trim();
  if (h === "localhost" || h === "127.0.0.1" || h === "::1") return false;
  if (h === "vercel.app" || h.endsWith(".vercel.app")) return false;
  return true;
}

/**
 * Resolve the sender address.
 *
 * Priority:
 *  1. Explicit EMAIL_FROM env var (must point at a verified domain).
 *  2. Derived from the app URL host, but only if that host is a real,
 *     verifiable domain (never vercel.app / localhost).
 *  3. In non-production: Resend's `onboarding@resend.dev` sandbox sender,
 *     which only delivers to the Resend account owner's email.
 *  4. In production with no usable sender: empty string -> sendEmail no-ops
 *     and logs an actionable warning instead of failing at the API.
 */
export function resolveEmailFrom(): string {
  const explicit = process.env.EMAIL_FROM?.trim();
  if (explicit) return explicit;

  const appUrl = process.env.EMAIL_APP_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();
  let host = "";
  try {
    if (appUrl) host = new URL(appUrl).hostname;
  } catch {
    host = "";
  }

  if (isVerifiableHost(host)) {
    return `Поднебесная <noreply@${host}>`;
  }

  if (process.env.NODE_ENV !== "production") {
    return "Поднебесная <onboarding@resend.dev>";
  }

  return "";
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = resolveEmailFrom();

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[email] RESEND_API_KEY not set. Would send to", to, "subject:", subject);
      console.info("[email] HTML:", html);
    } else {
      console.warn("[email] RESEND_API_KEY not set; email not sent to", to);
    }
    return false;
  }

  if (!from) {
    console.warn(
      "[email] No verified sender domain configured. Resend does not accept vercel.app (or unverified) domains. " +
        "Verify a custom domain in the Resend dashboard and set EMAIL_FROM (e.g. \"Поднебесная <noreply@yourdomain.com>\"). " +
        "Email not sent to",
      to
    );
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
      const raw = await res.text();
      let parsed: ResendErrorBody | null = null;
      try {
        parsed = JSON.parse(raw) as ResendErrorBody;
      } catch {
        parsed = null;
      }
      console.error("[email] Resend error:", raw);

      const message = (parsed?.message || raw || "").toLowerCase();
      if (
        res.status === 403 ||
        message.includes("domain") ||
        message.includes("verified") ||
        message.includes("not allowed")
      ) {
        console.error(
          "[email] Hint: verify a custom domain in Resend and set EMAIL_FROM to an address on that domain. " +
            "Shared domains like *.vercel.app cannot be used as senders."
        );
      }
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
