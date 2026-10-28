import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ success: false, error: "Не авторизован" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const tgToken = String(body.tgToken || "").trim();
  const tgChatId = String(body.tgChatId || "").trim();

  if (!tgToken) return NextResponse.json({ success: false, error: "Не указан Bot Token" });

  try {
    const meRes = await fetch(`https://api.telegram.org/bot${tgToken}/getMe`);
    const me = await meRes.json();
    if (!me.ok) {
      return NextResponse.json({ success: false, error: `Токен неверный: ${me.description || "ошибка"}` });
    }
    const botName = me.result?.username ? `@${me.result.username}` : me.result?.first_name || "бот";

    if (tgChatId) {
      const sendRes = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: tgChatId, text: "✅ Тестовое сообщение от «Поднебесная». Бот подключён." }),
      });
      const sendData = await sendRes.json();
      if (!sendData.ok) {
        return NextResponse.json({ success: false, error: `Бот ${botName} найден, но не удалось отправить сообщение: ${sendData.description || "ошибка"}. Проверьте Chat ID.` });
      }
      return NextResponse.json({ success: true, message: `Бот ${botName} подключён, тестовое сообщение отправлено.` });
    }
    return NextResponse.json({ success: true, message: `Бот ${botName} найден. Укажите Chat ID для отправки теста.` });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Ошибка сети при обращении к Telegram" });
  }
}
