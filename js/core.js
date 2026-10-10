'use strict';
const APP = {ver:'1.1.0', date:'10.10.2026'};
const NEWS = [
 'Курс вырос до 90 уроков: добавлены уровни A2 «Уверенный разговор» (уроки 31–60) и B1 «Свободно» (уроки 61–90).',
 'Новые темы: аэропорт, бронирование, потерянные вещи, возврат покупок, телефон, мессенджеры, спорт, школа, советы, споры, детство, мечты, банк, почта, аллергии, экология, технологии, экстренные ситуации, традиции, этикет, рассказ о России, собеседование, дискуссия.',
 'Первая версия: звуки и правила чтения, 400 слов A1–A2 с транскрипцией, диктант, неправильные глаголы.',
 'Фразы, 8 диалогов по ролям, аудирование, тексты для чтения с переводом по нажатию.',
 '16 уроков грамматики с упражнением «собери предложение», тренажёр чисел, времени, цен и дат.',
 'Очки опыта и дневная цель. Работает без интернета, можно поставить значок на экран «Домой».'
];

/* ===== СОСТОЯНИЕ ===== */
const LS = 'en_learn_v1';
const DAY = 864e5;
const DEF_SETTINGS = {rate:0.9, newPerDay:10, mode:'read', autoplay:true, voice:'', accent:'GB', goal:30};
let S = {srs:{}, daily:{}, snd:{ok:0,all:0}, xp:0, seenVer:'', sub:{}, gram:{}, settings:Object.assign({}, DEF_SETTINGS), tab:'home'};
function load(){ try{ const t=localStorage.getItem(LS); if(t){ const o=JSON.parse(t); S=Object.assign(S,o); S.settings=Object.assign({}, DEF_SETTINGS, o.settings||{}); S.sub=S.sub||{}; S.gram=S.gram||{}; } }catch(e){} }
function save(){ try{ localStorage.setItem(LS, JSON.stringify(S)); }catch(e){} }
function today(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function dayRec(){ const k=today(); return S.daily[k] || (S.daily[k]={nw:0,rev:0,q:0,qok:0,xp:0}); }
function addXP(n){ S.xp=(S.xp||0)+n; const r=dayRec(); const before=r.xp||0; r.xp=before+n; save();
  const g=S.settings.goal; if(before<g && r.xp>=g) toast('🎯 Дневная цель выполнена! Well done!', 3000); }

/* ===== УТИЛИТЫ ===== */
const $ = s => document.querySelector(s);
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];} return a; };
const pick = a => a[Math.random()*a.length|0];
const rnd = (a,b) => a + (Math.random()*(b-a+1)|0);
let toastT;
function toast(m, ms){ const t=$('#toast'); t.innerHTML=m; t.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('on'), ms||2200); }
// Тексты для кнопок храним в реестре: в onclick передаём номер, а не строку с апострофами
const TX = [];
function R(t){ TX.push(t); return TX.length-1; }
function sayI(i, rate, who){ say(TX[i], rate, who); }
function slowI(i){ say(TX[i], 0.6); }
function listenI(i, outId){ listen(TX[i], outId); }
// Кнопки «послушать / медленно / сказать»
function audioBtns(text, micId, who){
  const i = R(text);
  return `<button class="btn" onclick="sayI(${i},0,'${who||''}')" aria-label="Послушать">🔊</button><button class="btn" onclick="slowI(${i})">🐢</button>`
    + (micId ? `<button class="btn" onclick="listenI(${i},'${micId}')">🎤</button>` : '');
}
const ipa = s => s ? '<span class="ipa">['+s+']</span>' : '';

/* ===== ОЗВУЧКА ===== */
let enVoice = null, enVoiceB = null, voicesReady = false;
function enVoices(){ return ('speechSynthesis' in window) ? speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang)) : []; }
function pickVoice(){
  if(!('speechSynthesis' in window)) return;
  const all = speechSynthesis.getVoices(); if(all.length) voicesReady = true;
  const vs = enVoices(), acc = S.settings.accent==='US' ? /en[-_]US/i : /en[-_]GB/i;
  enVoice = vs.find(v=>v.name===S.settings.voice) || vs.find(v=>acc.test(v.lang)) || vs.find(v=>/en[-_](GB|US)/i.test(v.lang)) || vs[0] || null;
  enVoiceB = vs.find(v=>v!==enVoice && acc.test(v.lang)) || vs.find(v=>v!==enVoice) || null;
}
if('speechSynthesis' in window){ pickVoice(); speechSynthesis.onvoiceschanged = () => { pickVoice(); try{ if(S.tab==='home' && !CL) renderHome(); }catch(e){} }; }
function utter(text, rate, who){
  const u = new SpeechSynthesisUtterance(text);
  u.lang = S.settings.accent==='US' ? 'en-US' : 'en-GB';
  const v = who==='B' ? (enVoiceB || enVoice) : enVoice; if(v){ u.voice = v; u.lang = v.lang; }
  if(who==='B' && !enVoiceB) u.pitch = 1.3;
  u.rate = rate || S.settings.rate;
  return u;
}
function say(text, rate, who){
  if(!('speechSynthesis' in window)){ toast('Этот браузер не умеет озвучивать текст'); return; }
  speechSynthesis.cancel(); speechSynthesis.speak(utter(text, rate, who));
}
let sayQ = 0;
function sayQueue(items, onStep, onDone){
  if(!('speechSynthesis' in window)){ toast('Этот браузер не умеет озвучивать текст'); return; }
  speechSynthesis.cancel(); const id = ++sayQ; let i = 0;
  const next = () => { if(id!==sayQ) return; if(i>=items.length){ onDone && onDone(); return; }
    onStep && onStep(i); const u = utter(items[i].t, 0, items[i].who); i++;
    u.onend = () => setTimeout(next, 400); u.onerror = () => setTimeout(next, 400); speechSynthesis.speak(u); };
  next();
}
function stopSay(){ sayQ++; if('speechSynthesis' in window) speechSynthesis.cancel(); }

/* ===== ЧИСЛА ПО-АНГЛИЙСКИ (британский вариант) ===== */
const ONES = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function under100(n){ return n<20 ? ONES[n] : TENS[n/10|0] + (n%10 ? '-'+ONES[n%10] : ''); }
function numEn(n){
  if(n<100) return under100(n);
  let s = '', rest = n;
  if(rest>=1000){ s += under100(rest/1000|0)+' thousand'; rest %= 1000; }
  if(rest>=100){ s += (s?' ':'') + ONES[rest/100|0]+' hundred'; rest %= 100; }
  if(rest) s += (s?' and ':'') + under100(rest);
  return s;
}
const ORD_IRR = {one:'first',two:'second',three:'third',five:'fifth',eight:'eighth',nine:'ninth',twelve:'twelfth'};
function ordEn(n){
  const w = numEn(n), parts = w.split(/([ -])/), last = parts.pop();
  const o = ORD_IRR[last] || (/y$/.test(last) ? last.slice(0,-1)+'ieth' : last+'th');
  return parts.join('') + o;
}
function ordShort(n){ const s = (n%100>=11 && n%100<=13) ? 'th' : ({1:'st',2:'nd',3:'rd'})[n%10] || 'th'; return n+s; }
function yearEn(y){
  if(y>=2000 && y<2010) return 'two thousand' + (y%100 ? ' and '+ONES[y%100] : '');
  const a = y/100|0, b = y%100;
  return under100(a) + ' ' + (b===0 ? 'hundred' : b<10 ? 'oh '+ONES[b] : under100(b));
}
function timeEn(h, m){
  const hn = h%12 || 12, next = (h%12)+1;
  if(m===0) return ONES[hn]+" o'clock";
  if(m===15) return 'quarter past '+ONES[hn];
  if(m===30) return 'half past '+ONES[hn];
  if(m===45) return 'quarter to '+ONES[next>12?1:next];
  if(m<30) return under100(m)+(m%5?' minutes':'')+' past '+ONES[hn];
  return under100(60-m)+((60-m)%5?' minutes':'')+' to '+ONES[next>12?1:next];
}

/* ===== РАСПОЗНАВАНИЕ РЕЧИ ===== */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const EMBED = (() => { try { return window.self !== window.top; } catch(e){ return true; } })();
const wordsOf = s => (s.toLowerCase().replace(/[’']/g,"'").match(/[a-z0-9']+/g) || []);
function lcs(A,B){ const d=Array(B.length+1).fill(0);
  for(let i=1;i<=A.length;i++){ let prev=0; for(let j=1;j<=B.length;j++){ const t=d[j]; d[j]=A[i-1]===B[j-1]?prev+1:Math.max(d[j],d[j-1]); prev=t; } } return d[B.length]; }
function listen(target, outId){
  const out = document.getElementById(outId);
  if(EMBED){ out.innerHTML = '🎤 В этой версии микрофон закрыт. Послушайте → повторите вслух 3 раза → снова 🔊 и сравните.'; return; }
  if(!SR){ out.innerHTML = '🎤 Этот браузер не распознаёт речь. Тренируйтесь так: 🔊 послушайте → повторите вслух → сравните.'; return; }
  const r = new SR(); r.lang = S.settings.accent==='US' ? 'en-US' : 'en-GB'; r.interimResults=false; r.maxAlternatives=5;
  out.textContent = '🎤 Говорите…';
  r.onresult = e => {
    const tgt = wordsOf(target); let best=-1, heard='';
    for(const alt of e.results[0]){ const sc = lcs(tgt, wordsOf(alt.transcript)) / Math.max(1,tgt.length); if(sc>best){best=sc;heard=alt.transcript;} }
    const pct = Math.round(best*100); if(pct>=90) addXP(2);
    out.innerHTML = 'Услышано: <i>'+heard+'</i> — '+(pct>=90?'<b style="color:var(--ok)">отлично! '+pct+'%</b>':pct>=50?'<b style="color:var(--warn)">почти: '+pct+'%</b>':'<b style="color:var(--bad)">ещё раз: '+pct+'%</b>');
  };
  r.onerror = e => { out.textContent = 'Микрофон: ' + (e.error==='not-allowed'?'нет доступа (разрешите микрофон)':e.error==='no-speech'?'ничего не услышал':e.error); };
  try{ r.start(); }catch(e){ out.textContent='Не удалось включить микрофон'; }
}

/* ===== НАВИГАЦИЯ ===== */
const TABS = {home:()=>renderHome(), sounds:()=>renderSounds(), words:()=>renderWords(), talk:()=>renderTalk(),
  read:()=>renderRead(), rules:()=>renderRules(), stats:()=>renderStats()};
function show(tab){
  stopSay(); TX.length = 0;
  S.tab = tab; save();
  document.querySelectorAll('main section').forEach(s => s.hidden = s.id !== 't-'+tab);
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.t===tab));
  TABS[tab]();
  window.scrollTo(0,0);
}
function subnav(tab, items, cur){
  return '<div class="seg">'+items.map(([k,l])=>'<button class="'+(k===cur?'on':'')+'" onclick="S.sub.'+tab+'=\''+k+'\';save();stopSay();TABS.'+tab+'()">'+l+'</button>').join('')+'</div>';
}
// Сравнение введённого слова с ответом: без регистра, лишних пробелов и с любым апострофом
const norm = s => String(s).toLowerCase().replace(/[’`]/g,"'").replace(/\s+/g,' ').trim();
