const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safe=u=>/^https?:\/\//.test(u)?u:"#";
const stars=r=>"★".repeat(Math.round(r))+"☆".repeat(5-Math.round(r));
const SCOOP={assets:"assets/",pages:{home:"index.html",new:"new.html",other:"other.html",about:"about.html",support:"support.html",game:"game.html"}};
const gameUrl=id=>SCOOP.pages.game+"?id="+encodeURIComponent(id);
// الصورة الافتراضية للألعاب بلا صورة
const DEF_IMG='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a86ff"/><stop offset="1" stop-color="#2ec4a6"/></linearGradient><pattern id="d" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2" fill="#fff" fill-opacity=".25"/></pattern></defs><rect width="400" height="300" fill="url(#g)"/><rect width="400" height="300" fill="url(#d)"/><g transform="translate(200 150)" stroke="#1b1f3b" stroke-width="6" stroke-linejoin="round"><path d="M-95 -35Q-95 -55 -70 -55H70Q95 -55 95 -35L115 40Q120 70 90 70Q70 70 55 45H-55Q-70 70 -90 70Q-120 70 -115 40Z" fill="#ffc83d"/><path d="M-70 -20h14v-14h14v14h14v14h-14v14h-14v-14h-14z" fill="#1b1f3b" stroke="none"/><circle cx="55" cy="-22" r="10" fill="#ff5a5f"/><circle cx="80" cy="0" r="10" fill="#ff5a5f"/></g></svg>');
const imgSrc=g=>/^https?:\/\//.test((g.image||"").trim())?g.image.trim():DEF_IMG;
const imgTag=(g,extra="")=>`<img src="${esc(imgSrc(g))}" alt="" ${extra} onerror="this.onerror=null;this.src=DEF_IMG">`;

function parseCSV(t){const rows=[];let r=[],f="",q=false;for(let i=0;i<t.length;i++){const c=t[i];if(q){if(c=='"'){if(t[i+1]=='"'){f+='"';i++}else q=false}else f+=c}else if(c=='"')q=true;else if(c==","){r.push(f);f=""}else if(c=="\n"||c=="\r"){if(c=="\r"&&t[i+1]=="\n")i++;r.push(f);rows.push(r);r=[];f=""}else f+=c}if(f||r.length){r.push(f);rows.push(r)}return rows}
async function loadGames(){let list=SAMPLE;
  if(CONFIG.sheetCsvUrl){try{const res=await fetch(CONFIG.sheetCsvUrl);const rows=parseCSV(await res.text()).filter(r=>r.some(x=>x.trim()));const h=rows.shift().map(x=>x.trim());list=rows.map((r,i)=>{const g={};for(const k in CONFIG.columns)g[k]=(r[h.indexOf(CONFIG.columns[k])]||"").trim();g.id=g.id||String(i+1);return g}).filter(g=>g.title&&/^https?:\/\//.test(g.url))}catch(e){console.error("تعذّر تحميل الشيت",e)}}
  let R={};if(CONFIG.apiUrl){try{R=await(await fetch(CONFIG.apiUrl+"?action=ratings")).json()}catch(e){console.error(e)}}
  return list.map(g=>({...g,rating:R[g.id]?+R[g.id].avg||0:parseFloat(g.rating)||0}))}

const card=(g,n)=>`<a class="card" href="${esc(gameUrl(g.id))}"><div class="thumb">${imgTag(g,'loading="lazy"')}</div><div class="info"><b>${esc(g.title)}</b><span class="stars">${stars(g.rating)} ${g.rating?(+g.rating).toFixed(1):""}</span></div>${n?`<i class="num n${n}">${n}</i>`:""}</a>`;
const main=$("#main"), page=document.body.dataset.page;
// الترويسة: اللوجو في وسط شريط القوائم
const nav=(items)=>`<ul class="navgrp ${items.side}">${items.l.map(([k,t])=>`<li><a href="${SCOOP.pages[k]}"${k==page?' class="on"':""}>${t}</a></li>`).join("")}</ul>`;
$("#header").innerHTML=`<div class="bar">${nav({side:"right",l:[["home","الرئيسية"],["new","جديد"]]})}<a class="logo" href="index.html" aria-label="سكوب الألعاب"><img src="${SCOOP.assets}logo.png" alt="سكوب الألعاب"></a>${nav({side:"left",l:[["other","ألعاب أخرى"],["about","حول الموقع"],["support","ادعمنا"]]})}</div>`;
document.body.insertAdjacentHTML("beforeend",`<footer class="site-footer">سكوب الألعاب · للترفيه فقط</footer>`);

const pages={
async home(){const gs=await loadGames(),cats=[...new Set(gs.map(g=>g.category).filter(Boolean))];let cat="";
  const top=[...gs].sort((a,b)=>b.rating-a.rating).slice(0,6);
  main.innerHTML=`<h2 class="tag">اختر القسم والعب لعبة بالحظ</h2><div class="chips" id="chips"></div><div class="home"><section><h3>الألعاب الأعلى تقييمًا في موقعنا</h3><div class="grid">${top.map((g,i)=>card(g,i+1)).join("")}</div></section><aside><a class="big" href="${esc(safe(CONFIG.youtubeSiteUrl))}"><img src="${SCOOP.assets}icon.png" alt=""><b>سكوب</b><span>ألعاب يوتيوب</span></a><a class="big" href="#" id="rand"><img src="${SCOOP.assets}icon.png" alt=""><b>سكوب</b><span>ألعاب itch.io</span></a></aside></div>`;
  const chips=$("#chips");const draw=()=>{chips.innerHTML=["",...cats].map(c=>`<button type="button" class="pill" aria-pressed="${c==cat}" data-c="${esc(c)}">${c||"كل الأقسام"}</button>`).join("")};draw();
  chips.onclick=e=>{if(e.target.dataset.c!==undefined){cat=e.target.dataset.c;draw()}};
  $("#rand").onclick=e=>{e.preventDefault();const p=gs.filter(g=>!cat||g.category==cat);if(!p.length){alert("لا توجد ألعاب في هذا القسم.");return}location.href=gameUrl(p[Math.floor(Math.random()*p.length)].id)}},
async new(){const gs=await loadGames();const s=gs.some(g=>g.date)?[...gs].sort((a,b)=>new Date(b.date)-new Date(a.date)):[...gs].reverse();
  main.innerHTML=`<h3>جديد</h3><div class="grid">${s.slice(0,24).map(g=>card(g)).join("")}</div>`},
other(){main.innerHTML=`<h3>ألعاب أخرى</h3>`+(CONFIG.articles.length?CONFIG.articles.map(a=>`<a class="box" href="${esc(safe(a.url))}"><b>${esc(a.title)}</b><p>${esc(a.text)}</p></a>`).join(""):`<div class="box">ستُضاف المقالات قريبًا.</div>`)},
about(){main.innerHTML=`<div class="box center"><p>السلام عليكم ورحمة الله وبركاته</p><p>تم بحمد الله تصميم هذا الموقع من طرف فطر رقمي وتشغيله بـ Claude AI</p><p>هذا الموقع للترفيه وجميع الروابط والألعاب آمنة</p><p>في حال وجدت لعبة فيها ما يسوؤك احفظ رقم اللعبة وأبلغ عنها</p><button class="btn" id="rep" type="button">التبليغ عن لعبة</button></div>`;$("#rep").onclick=()=>openReport()},
support(){const C=["#000","#FF5A5F","#3A86FF","#CA5AFF","#7777FF","#01B3FB","#CF3131","#DF4BDF"];main.innerHTML=`<h3>ادعمنا</h3><div class="social">${Object.entries(CONFIG.social).map(([n,u],i)=>`<a class="soc" style="background:${C[i%8]}" href="${esc(safe(u))}" target="_blank" rel="noopener">على ${esc(n)}</a>`).join("")}</div>`},
async game(){const gs=await loadGames(),id=new URLSearchParams(location.search).get("id"),g=gs.find(x=>x.id==id);
  if(!g){main.innerHTML=`<div class="box center">اللعبة غير موجودة.</div>`;return}
  main.innerHTML=`<div class="gamepage"><div class="shot">${imgTag(g)}</div><div class="det"><p><b>لعبة :</b> ${esc(g.title)} <small>(رقم اللعبة: ${esc(g.id)})</small></p><p><b>الفئة العمرية :</b> ${esc(g.age)}</p><p><b>تصنيفها :</b> ${esc(g.category)}</p><p><b>الوصف :</b> ${esc(g.description)}</p><p class="stars">${stars(g.rating)} ${g.rating?(+g.rating).toFixed(1):""}</p><p id="rate"></p><a class="btn" href="${esc(safe(g.url))}" target="_blank" rel="noopener sponsored">العب الآن</a> <button class="pill" id="rep" type="button">🚩 التبليغ</button></div></div>`;$("#rep").onclick=()=>openReport(g.id);rateUI(g.id)}};
if(pages[page])pages[page]();

function rateUI(id){const el=$("#rate"),k="rated_"+id;
  const draw=v=>{el.innerHTML=v?`<small>شكرًا لتقييمك: ${stars(v)}</small>`:`قيّم اللعبة: ${[1,2,3,4,5].map(n=>`<button class="star" type="button" data-n="${n}">★</button>`).join("")}`};
  draw(+localStorage.getItem(k)||0);
  el.onclick=async e=>{const n=+e.target.dataset.n;if(!n||localStorage.getItem(k))return;
    if(!CONFIG.apiUrl){el.textContent="التقييم غير مفعّل بعد";return}
    try{await fetch(CONFIG.apiUrl,{method:"POST",body:JSON.stringify({action:"rate",id,stars:n})});localStorage.setItem(k,n);draw(n)}catch(_){el.textContent="تعذّر الإرسال"}}}
function openReport(id=""){const R=["قمار أو مراهنات","محتوى غير أخلاقي أو غير لائق","عنف مبالغ فيه","محتوى مسيء أو يحرّض على الكراهية","اللعبة لا تعمل أو الرابط خاطئ","صورة أو اسم غير مناسب","سبب آخر"];let tok="";
  const d=document.createElement("div");d.className="modal";
  d.innerHTML=`<div class="box"><h3>التبليغ عن لعبة</h3><label>رقم اللعبة<input id="r_id" value="${esc(id)}"></label><label>سبب التبليغ<select id="r_why"><option value="">اختر السبب...</option>${R.map(x=>`<option>${x}</option>`).join("")}</select></label><label>تفاصيل إضافية (اختياري)<textarea id="r_d" maxlength="500"></textarea></label><input id="r_hp" class="hp" tabindex="-1" autocomplete="off"><div id="ts"></div><p id="r_m"></p><button class="btn" id="r_s" type="button">إرسال البلاغ</button> <button class="pill" id="r_c" type="button">إلغاء</button></div>`;
  document.body.appendChild(d);const m=$("#r_m");$("#r_c").onclick=()=>d.remove();
  if(CONFIG.turnstileSiteKey){const s=document.createElement("script");s.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";s.onload=()=>turnstile.render("#ts",{sitekey:CONFIG.turnstileSiteKey,callback:t=>tok=t});document.head.appendChild(s)}
  $("#r_s").onclick=async()=>{const b={action:"report",id:$("#r_id").value.trim(),reason:$("#r_why").value,details:$("#r_d").value,hp:$("#r_hp").value,token:tok};
    if(!b.id||!b.reason){m.textContent="أدخل رقم اللعبة واختر السبب";return}
    if(!CONFIG.apiUrl){m.textContent="التبليغ غير مفعّل بعد";return}
    if(CONFIG.turnstileSiteKey&&!tok){m.textContent="أكمل التحقق أولًا";return}
    try{const r=await(await fetch(CONFIG.apiUrl,{method:"POST",body:JSON.stringify(b)})).json();m.textContent=r.ok?"تم إرسال البلاغ، شكرًا لك":"تعذّر الإرسال، حاول لاحقًا";if(r.ok)setTimeout(()=>d.remove(),1500)}catch(_){m.textContent="تعذّر الإرسال، حاول لاحقًا"}}}
