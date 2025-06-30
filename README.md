# نظام الجفر الذكي المتقدم

## نشر المشروع على Netlify

### خطوات النشر:

#### 1. إعداد المشروع:
```bash
# بناء المشروع
npm run build
```

#### 2. رفع المشروع على GitHub:
- أنشئ repository جديد على GitHub
- ارفع الكود:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/jafr-system.git
git push -u origin main
```

#### 3. النشر على Netlify:
1. اذهب إلى [Netlify](https://app.netlify.com)
2. اضغط على "New site from Git"
3. اختر GitHub واربط حسابك
4. اختر المشروع
5. إعدادات البناء:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
   - **Functions directory**: `netlify/functions`

#### 4. متغيرات البيئة:
في إعدادات Netlify، أضف:
- `OPENROUTER_API_KEY` (اختياري): مفتاح OpenRouter API

#### 5. إعدادات Netlify:
- تأكد من تفعيل **Netlify Functions**
- اضبط **Node.js version** على 20

### ملاحظات مهمة:

#### للمستخدمين:
- النظام يعمل بدون قاعدة بيانات على Netlify (صفحة السجل لن تعمل)
- يحتاج المستخدمون لإدخال مفتاح OpenRouter API للحصول على التحليل الذكي
- النظام يدعم التحليل التقليدي بدون مفتاح API

#### الميزات المتاحة:
- ✅ حساب الجفر التقليدي
- ✅ التحليل الذكي مع OpenRouter API
- ✅ واجهة عربية كاملة
- ✅ تصميم متجاوب
- ❌ حفظ التحليلات (يتطلب قاعدة بيانات)

### للتطوير المحلي:
```bash
npm install
npm run dev
```

### للإنتاج مع قاعدة البيانات:
استخدم Vercel أو Railway للحصول على دعم قاعدة البيانات PostgreSQL.

### روابط مفيدة:
- [OpenRouter API](https://openrouter.ai/) - للحصول على مفتاح API
- [Netlify Functions](https://docs.netlify.com/functions/overview/) - دليل الوظائف
- [Vercel](https://vercel.com/) - بديل يدعم قواعد البيانات