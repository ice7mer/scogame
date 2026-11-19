/* ===== إعدادات الموقع: عدّل هنا فقط ===== */
const CONFIG = {
  sheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMUut0z36t7-9ar6TstR2okLwwykQnvKSegRUPYNJYgAd-NbPA1Cw_sfjjo7vJeOEF30B6jVeTbVCH/pubhtml?gid=0&single=true",          // رابط الورقة الأولى في الشيت: ملف > مشاركة > نشر على الويب > CSV
  apiUrl: "https://script.google.com/macros/s/AKfycbyIXhTOZDJ5A6XDSCUJNYcUZbgeUBb4iDCspX-riAPsRBSvhTSCRWSsS6DC1pukLzpj/exec",               // رابط Web app من Apps Script (التقييم والتبليغ) - انظر Web.gs
  turnstileSiteKey: "0x4AAAAAAGIwyUVv__q6ZjZf", // مفتاح Cloudflare Turnstile (أضف نطاق موقعك إليه في Cloudflare)
  youtubeSiteUrl: "https://yt-scogame.onrender.com/",
  // يسار: اسم داخلي (لا تغيّره)، يمين: عنوان العمود في الشيت
  columns: { id:"ID", title:"Name", image:"Image_URL", category:"Category", age:"Age", description:"Description", url:"Affiliate_Link", rating:"Rating", date:"Date" },
  // ===== روابط التواصل: ضع الرابط بين علامتي الاقتباس (الفارغ لا يعمل) =====
  social: { "X":"", "يوتيوب":"", "تلجرام":"", "ديسكورد":"", "تويتش":"", "فيسبوك":"", "تيك توك":"", "انستغرام":"" },
  // مقالات صفحة "ألعاب أخرى": أضف {title:"..", text:"..", url:".."}
  articles: []
};
const SAMPLE = [
  {id:"1",title:"لعبة تجريبية 1",image:"",category:"مغامرة",age:"+7",description:"وصف تجريبي للعبة.",url:"https://itch.io",rating:"4.8",date:"2026-11-16"},
  {id:"2",title:"لعبة تجريبية 2",image:"",category:"ألغاز",age:"+7",description:"وصف تجريبي للعبة.",url:"https://itch.io",rating:"4.6",date:"2026-11-15"},
  {id:"3",title:"لعبة تجريبية 3",image:"",category:"سباق",age:"+3",description:"وصف تجريبي للعبة.",url:"https://itch.io",rating:"4.5",date:"2026-11-14"},
  {id:"4",title:"لعبة تجريبية 4",image:"",category:"مغامرة",age:"+7",description:"وصف تجريبي للعبة.",url:"https://itch.io",rating:"4.2",date:"2026-11-13"},
  {id:"5",title:"لعبة تجريبية 5",image:"",category:"ألغاز",age:"+12",description:"وصف تجريبي للعبة.",url:"https://itch.io",rating:"4.0",date:"2026-11-12"},
  {id:"6",title:"لعبة تجريبية 6",image:"",category:"سباق",age:"+7",description:"وصف تجريبي للعبة.",url:"https://itch.io",rating:"3.9",date:"2026-11-11"},
  {id:"7",title:"لعبة تجريبية 7",image:"",category:"مغامرة",age:"+7",description:"وصف تجريبي للعبة.",url:"https://itch.io",rating:"3.5",date:"2026-11-10"}
];
