# إعداد محادثة Gemini داخل موقع الأفق

الكود موجود في المستودع، لكن GitHub Pages وحده لا يشغّل واجهة API. لن تظهر إجابات Gemini على رابط GitHub Pages؛ انشر المشروع على Cloudflare Pages أولًا.

## خطوات التشغيل

1. في Cloudflare Pages أنشئ مشروعًا واربطه بمستودع `mohammedhadi20010211-alt/h`، واجعل مجلد البناء جذر المستودع. لا يلزم أمر بناء لموقع HTML الثابت.
2. أنشئ مفتاح Gemini من Google AI Studio.
3. في Cloudflare افتح مشروع Pages ثم **Settings → Variables and Secrets**، وأضف متغيرًا سرّيًا (Secret) باسم `GEMINI_API_KEY` والصق المفتاح في قيمة السر. لا تضفه إلى GitHub أو ملفات HTML، ولا ترسله في المحادثة.
4. احفظ الإعداد وأعد نشر المشروع. واجهة API موجودة في `functions/api/chat.js`، ومسارها `/api/chat`.
5. افتح `https://<اسم-مشروعك>.pages.dev/chat.html`، ثم أرسل رسالة تجريبية.

اختياري: أضف متغيرًا عاديًا باسم `GEMINI_MODEL` لتحديد النموذج؛ الافتراضي `gemini-2.5-flash`. راجع حدود الاستخدام والفوترة في حساب Google. احمِ نقطة API من الاستخدام المسيء إذا كان الموقع عامًا.
