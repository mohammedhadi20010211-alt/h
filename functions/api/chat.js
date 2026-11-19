export async function onRequestPost({ request, env }) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  };

  if (!env.GEMINI_API_KEY) {
    return Response.json({ error: 'المحادثة غير مهيأة بعد: أضف GEMINI_API_KEY إلى أسرار Cloudflare Pages.' }, { status: 503, headers });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400, headers });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 30) {
    return Response.json({ error: 'أرسل من 1 إلى 30 رسالة.' }, { status: 400, headers });
  }

  const contents = [];
  for (const message of body.messages) {
    if (!message || !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string') {
      return Response.json({ error: 'إحدى الرسائل غير صالحة.' }, { status: 400, headers });
    }
    const text = message.content.trim().slice(0, 8000);
    if (text) {
      contents.push({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text }],
      });
    }
  }

  if (!contents.length || contents[contents.length - 1].role !== 'user') {
    return Response.json({ error: 'يجب أن تنتهي المحادثة برسالة من المستخدم.' }, { status: 400, headers });
  }

  const model = env.GEMINI_MODEL || 'gemini-2.5-flash';
  let upstream;
  try {
    upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: 1200, temperature: 0.7 },
      }),
    });
  } catch {
    return Response.json({ error: 'تعذر الاتصال بخدمة Gemini. حاول لاحقًا.' }, { status: 502, headers });
  }

  const result = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    return Response.json({ error: 'تعذر الحصول على رد من Gemini. تحقق من مفتاح API وإعداداته.' }, { status: 502, headers });
  }

  const reply = result.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim();

  if (!reply) {
    return Response.json({ error: 'لم يُرجع Gemini نصًا. أعد المحاولة.' }, { status: 502, headers });
  }

  return Response.json({ reply }, { headers });
}
