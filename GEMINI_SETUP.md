# تشغيل محادثة Gemini داخل موقع الأفق

أُضيفت واجهة المحادثة وواجهة API كـ Cloudflare Pages Function. لا يمكن تشغيل هذه الوظيفة على GitHub Pages وحده؛ يجب نشر الموقع على Cloudflare Pages لكي يعمل المسار `/api/chat`.

## الإعداد

1. اربط مستودع `mohammedhadi20010211-alt/h` بمشروع Cloudflare Pages، واجعل مجلد البناء هو جذر المستودع، واترك أمر البناء فارغًا للموقع الثابت.
2. من **Settings → Variables and Secrets** أضف `GEMINI_API_KEY` كـ **Secret**. أنشئ المفتاح في Google AI Studio، ولا تضعه في ملفات الموقع أو GitHub.
3. (اختياري) أضف `GEMINI_MODEL` كمتغير، والقيمة الافتراضية `gemini-2.5-flash`.
4. أعد النشر، ثم افتح `/chat.html` على نطاق Cloudflare Pages. نموذج المحادثة يتصل بالمسار النسبي `/api/chat`، والمفتاح يبقى في الخادم.

لا تشارك مفتاح API علنًا. راجع حدود الاستخدام والفوترة في حساب Google قبل تفعيل الخدمة.
