'use strict';
/* ===== СТАРТ ===== */
function voiceWarn(){
  if(!('speechSynthesis' in window)) return '<div class="warn">⚠ Браузер не поддерживает озвучку. Откройте в Chrome, Edge или Safari.</div>';
  if(voicesReady && !enVoice) return '<div class="warn">⚠ Не найден английский голос — без него не будет звука. Обновите браузер или добавьте английский язык в настройках системы.</div>';
  return '';
}
function counts(){
  const now=Date.now(); let learn=0, known=0, due=0;
  for(const w of WORDS){ const s=S.srs[w[0]]; if(!s) continue; if(s.r>=1 && s.i>=3) known++; else learn++; if(s.d<=now) due++; }
  return {learn, known, due, fresh: WORDS.length-learn-known};
}
function streak(){ let n=0; const d=new Date();
  for(;;){ const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    const r=S.daily[k]; if(r && (r.nw||r.rev||r.q||r.xp)){ n++; d.setDate(d.getDate()-1); }
    else { if(n===0 && k===today()){ d.setDate(d.getDate()-1); continue; } break; }
    if(n>3650) break; }
  return n; }
function levelOf(xp){ let lv=1, need=50, acc=0; while(xp>=acc+need){ acc+=need; lv++; need=Math.round(need*1.3); } return {lv, cur:xp-acc, need}; }
function closeNews(){ S.seenVer=APP.ver; save(); renderHome(); }
function renderHome(){
  if(CL) return renderStep();
  const c=counts(), r=dayRec(), wd=pick(WORDS), L=levelOf(S.xp||0), g=S.settings.goal, dx=r.xp||0;
  const newLeft=Math.max(0,S.settings.newPerDay-r.nw);
  const news = S.seenVer===APP.ver ? '' : `<div class="card news"><b>Что нового в версии ${APP.ver}</b>
    <ul>${NEWS.map(n=>'<li>'+n+'</li>').join('')}</ul><button class="btn" onclick="closeNews()">Понятно</button></div>`;
  const wi = R(wd[0]);
  $('#t-home').innerHTML = voiceWarn() + news + `
  <div class="card"><h2>Hello! Добро пожаловать</h2>
   <div class="mut">Главное — курс «Разговор на улице»: один урок в день, 30 уроков. Слова повторяйте в карточках, остальные вкладки — дополнительная практика.</div>
   <div style="margin-top:10px"><div class="row" style="justify-content:space-between"><b>Цель дня: ${Math.min(dx,g)} / ${g} очков</b><span class="mut">${dx>=g?'✅ выполнена':''}</span></div>
    <div class="bar" style="margin-top:4px"><i style="width:${Math.min(100,dx/g*100)}%"></i></div>
    <div class="mut" style="margin-top:4px">Уровень ${L.lv} · ${L.cur} / ${L.need} до следующего · всего ${S.xp||0} очков</div></div>
   <div class="kpi" style="margin-top:10px">
    <div><b>${c.due}</b><span class="mut">к повторению</span></div>
    <div><b>${newLeft}</b><span class="mut">новых слов сегодня</span></div>
    <div><b>${c.known}</b><span class="mut">слов выучено из ${WORDS.length}</span></div>
    <div><b>${streak()}</b><span class="mut">дней подряд</span></div>
   </div></div>
  ${courseBlock()}
  <div class="card center"><div class="mut">Случайное слово</div>
   <div class="word big" style="cursor:pointer" onclick="sayI(${wi})">${wd[0]}</div>
   <div>${ipa(wd[1])}</div><div>${wd[2]}</div>
   <button class="btn" onclick="sayI(${wi})">🔊 Послушать</button></div>
  <div class="card mut">Нажмите на любое английское слово — оно прозвучит. Акцент (британский или американский) меняется в ⚙.<br>
   На iPhone: «Поделиться» → «На экран Домой» — появится значок, и тренажёр будет работать даже без интернета.</div>`;
}
