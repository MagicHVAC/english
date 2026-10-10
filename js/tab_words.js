'use strict';
/* ===== СЛОВА: карточки, тест, диктант, неправильные глаголы ===== */
let Q = [], cur = null, QZ = null, DL = 0;
function renderWords(){
  const sub = S.sub.words || 'cards';
  $('#t-words').innerHTML = subnav('words', [['cards','Карточки'],['quiz','Тест'],['dict','Диктант'],['irr','Неправильные'],['all','Словарь']], sub) + '<div id="wBody"></div>';
  ({cards:cardsEnter, quiz:startQuiz, dict:dictNext, irr:irrEnter, all:allWords})[sub]();
}

/* ---- карточки с интервальным повторением ---- */
function buildQueue(){
  const now=Date.now();
  const due = shuffle(WORDS.filter(w => S.srs[w[0]] && S.srs[w[0]].d <= now));
  const newLeft = Math.max(0, S.settings.newPerDay - dayRec().nw);
  Q = due.concat(WORDS.filter(w => !S.srs[w[0]]).slice(0, newLeft));
}
function moreNew(){ const extra = WORDS.filter(w => !S.srs[w[0]] && !Q.includes(w)).slice(0,5); if(!extra.length){toast('Все слова уже в изучении 🎉');return;} Q = Q.concat(extra); renderCard(); }
function cardsEnter(){
  const m = S.settings.mode;
  $('#wBody').innerHTML = `<div class="seg">
    <button class="${m==='read'?'on':''}" onclick="setMode('read')">слово → смысл</button>
    <button class="${m==='listen'?'on':''}" onclick="setMode('listen')">🔊 → смысл</button>
    <button class="${m==='recall'?'on':''}" onclick="setMode('recall')">смысл → слово</button></div>
   <div class="mut" id="winfo"></div><div class="card" id="card"></div>`;
  if(!Q.length) buildQueue(); renderCard();
}
function setMode(m){ S.settings.mode=m; save(); cardsEnter(); }
function winfo(){ const c=counts(); const el=$('#winfo'); if(el) el.textContent = 'В очереди: '+Q.length+' · к повторению: '+c.due+' · новых сегодня: '+dayRec().nw+'/'+S.settings.newPerDay+' · выучено: '+c.known; }
function wordBack(w){
  const i = R(w[0]);
  return `<div class="word big" onclick="sayI(${i})" style="cursor:pointer">${w[0]}</div>
   <div class="center">${ipa(w[1])}</div><div class="center" style="font-size:20px;margin-top:4px">${w[2]}</div>
   <div class="row" style="justify-content:center;margin-top:8px"><button class="btn" onclick="sayI(${i})">🔊</button><button class="btn" onclick="slowI(${i})">🐢 медленно</button>
    <button class="btn" onclick="listenI(${i},'cm')">🎤 скажи</button></div><div id="cm" class="res center"></div>`;
}
function renderCard(){
  winfo();
  const box = $('#card'); if(!box) return;
  if(!Q.length){
    box.innerHTML = `<div class="center"><div style="font-size:48px">🎉</div><b>На сегодня всё!</b>
     <div class="mut">Возвращайтесь завтра — программа сама напомнит, что пора повторить.</div>
     <button class="primary" onclick="moreNew()">Ещё 5 новых слов</button></div>`; return;
  }
  cur = Q[0];
  const isNew = !S.srs[cur[0]], m = S.settings.mode;
  if(isNew){
    box.innerHTML = `<span class="badge">новое слово · ${cur[3]===1?'A1':cur[3]===2?'A2':'курс'}</span>${wordBack(cur)}
     <div class="mut center" style="margin-top:6px">Послушайте 2–3 раза и повторите вслух. Через пару карточек слово вернётся для проверки.</div>
     <button class="primary" onclick="introduce()">Запомнил, дальше</button>`;
    if(S.settings.autoplay) setTimeout(()=>say(cur[0]),250);
    return;
  }
  const front = m==='read' ? `<div class="word big">${cur[0]}</div><div class="mut center">Что это значит?</div>`
    : m==='listen' ? `<div class="center"><button class="huge" onclick="say(cur[0])" aria-label="Послушать">🔊</button><div class="mut">Что это значит?</div></div>`
    : `<div class="ru big center">${cur[2]}</div><div class="mut center">Вспомните слово и как оно звучит</div>`;
  box.innerHTML = `<div>${front}</div><button class="primary" onclick="reveal()">Показать ответ</button>`;
  if(m==='listen') setTimeout(()=>say(cur[0]),250);
}
function introduce(){
  S.srs[cur[0]] = {i:0, e:2.5, d:Date.now(), r:0, l:0};
  dayRec().nw++; addXP(2);
  Q.shift(); Q.splice(Math.min(3,Q.length), 0, cur);
  renderCard();
}
function reveal(){
  $('#card').innerHTML = wordBack(cur) + `<div class="mut center" style="margin-top:8px">Насколько хорошо вспомнили?</div>
   <div class="rate"><button class="r0" onclick="rate(0)">Не помню</button><button class="r1" onclick="rate(1)">Трудно</button>
   <button class="r2" onclick="rate(2)">Помню</button><button class="r3" onclick="rate(3)">Легко</button></div>`;
  if(S.settings.autoplay && S.settings.mode!=='listen') say(cur[0]);
}
function grade(key, g){
  const now = Date.now(); const s = S.srs[key] || {i:0,e:2.5,d:now,r:0,l:0};
  if(g===0){ s.r=0; s.l++; s.i=0; s.e=Math.max(1.3,s.e-0.2); s.d=now; }
  else{
    if(g===1){ s.i = s.r===0 ? 0.5 : Math.max(1, s.i*1.2); s.e=Math.max(1.3,s.e-0.15); }
    else if(g===2){ s.i = s.r===0 ? 1 : s.r===1 ? 3 : Math.round(s.i*s.e); }
    else { s.i = s.r===0 ? 3 : Math.round(s.i*s.e*1.3)+1; s.e+=0.15; }
    s.r++; s.d = now + s.i*DAY;
  }
  S.srs[key] = s;
}
function rate(g){
  grade(cur[0], g); dayRec().rev++; addXP(1);
  Q.shift(); if(g===0) Q.splice(Math.min(3,Q.length), 0, cur);
  renderCard();
}

/* ---- тест ---- */
function startQuiz(){
  const pool = WORDS.filter(w => S.srs[w[0]]);
  const src = pool.length>=4 ? pool : WORDS.filter(w=>w[3]===1).slice(0,40);
  const qs = shuffle(src).slice(0,10).map(w => {
    const others = shuffle(WORDS.filter(x => x!==w && x[2]!==w[2])).slice(0,3);
    return {w, type: pick(['read','listen','recall','spell']), opts: shuffle([w].concat(others))};
  });
  QZ = {qs, i:0, ok:0, done:false};
  $('#wBody').innerHTML = `${pool.length<4?'<div class="mut">Пока мало изученных слов — тест по первым словам A1.</div>':''}<div class="card" id="qz"></div>`;
  renderQuiz();
}
function renderQuiz(){
  const box=$('#qz'); if(!box) return;
  if(QZ.i >= QZ.qs.length){
    const n=QZ.qs.length; box.innerHTML = `<div class="center"><div style="font-size:48px">${QZ.ok>=n*.8?'🏆':QZ.ok>=n*.5?'👍':'💪'}</div>
     <b>Результат: ${QZ.ok} из ${n}</b><div class="mut">Ошибки отправлены на повторение.</div>
     <button class="primary" onclick="startQuiz()">Ещё тест</button></div>`;
    return;
  }
  const q = QZ.qs[QZ.i]; QZ.done=false;
  const qi = R(q.w[0]);
  if(q.type==='spell'){
    box.innerHTML = `<div class="mut">Вопрос ${QZ.i+1} из ${QZ.qs.length} · верно: ${QZ.ok}</div>
     <div class="center"><button class="huge" onclick="sayI(${qi})" aria-label="Послушать">🔊</button><div class="mut">Напишите слово, которое услышали (подсказка: ${q.w[2]})</div></div>
     <input type="text" id="qzIn" autocomplete="off" autocapitalize="off" spellcheck="false" style="margin-top:8px" onkeydown="if(event.key==='Enter')qzSpell()">
     <button class="primary" onclick="qzSpell()">Проверить</button><div id="qzr" class="res"></div>`;
    setTimeout(()=>say(q.w[0]),250); return;
  }
  const head = q.type==='read' ? `<div class="word big">${q.w[0]}</div><div class="mut center">Что значит?</div>`
    : q.type==='listen' ? `<div class="center"><button class="huge" onclick="sayI(${qi})" aria-label="Послушать">🔊</button><div class="mut">Что услышали?</div></div>`
    : `<div class="ru big center">${q.w[2]}</div><div class="mut center">Выберите слово</div>`;
  const lab = o => q.type==='recall' ? `<span class="word" style="font-size:22px">${o[0]}</span>` : o[2];
  box.innerHTML = `<div class="mut">Вопрос ${QZ.i+1} из ${QZ.qs.length} · верно: ${QZ.ok}</div>${head}
   <div class="opts" id="qzo">${q.opts.map((o,k)=>`<button onclick="qzAns(${k})">${lab(o)}</button>`).join('')}</div><div id="qzr" class="res"></div>`;
  if(q.type==='listen') setTimeout(()=>say(q.w[0]),250);
}
function qzResult(ok){
  const q=QZ.qs[QZ.i], r=dayRec(); QZ.done=true;
  r.q++; if(ok){ r.qok++; QZ.ok++; addXP(2); } else { const s=S.srs[q.w[0]]; if(s){ s.l++; s.d=Date.now(); } save(); }
  say(q.w[0]);
  $('#qzr').innerHTML = `<div class="center"><span class="word mid">${q.w[0]}</span> ${ipa(q.w[1])} — ${q.w[2]}</div>
   <button class="primary" onclick="QZ.i++;renderQuiz()">Дальше →</button>`;
}
function qzAns(k){
  if(QZ.done) return; const q=QZ.qs[QZ.i], right=q.opts.indexOf(q.w), ok=k===right;
  const bs=document.querySelectorAll('#qzo button'); bs[right].classList.add('ok'); if(!ok) bs[k].classList.add('bad');
  qzResult(ok);
}
function qzSpell(){
  if(QZ.done) return; const q=QZ.qs[QZ.i], v=norm($('#qzIn').value), ok = v===norm(q.w[0]);
  $('#qzIn').classList.add(ok?'okIn':'badIn'); qzResult(ok);
}

/* ---- диктант ---- */
let DC = null;
function dictNext(){
  const known = WORDS.filter(w => S.srs[w[0]]);
  const pool = known.length>=5 ? known : WORDS.filter(w=>w[3]===1);
  const w = pick(pool);
  DC = {w, done:false, n:(DC?DC.n:0), ok:(DC?DC.ok:0)};
  const i = R(w[0]);
  $('#wBody').innerHTML = `<h2>Диктант</h2><div class="mut">Послушайте и напишите слово. ${known.length>=5?'Слова из ваших карточек.':'Пока слова A1.'} Счёт: ${DC.ok} из ${DC.n}</div>
   <div class="card"><div class="center"><button class="huge" onclick="sayI(${i})" aria-label="Послушать">🔊</button>
    <div class="row" style="justify-content:center;margin-top:6px"><button class="btn" onclick="slowI(${i})">🐢 медленно</button><button class="btn" onclick="$('#dcHint').hidden=false">Подсказка</button></div>
    <div id="dcHint" class="mut" hidden>${w[2]} · ${w[0].length} букв</div></div>
   <input type="text" id="dcIn" autocomplete="off" autocapitalize="off" spellcheck="false" style="margin-top:8px" onkeydown="if(event.key==='Enter')dictCheck()">
   <button class="primary" onclick="dictCheck()">Проверить</button><div id="dcr" class="res"></div></div>`;
  setTimeout(()=>say(w[0]),250);
}
function dictCheck(){
  if(DC.done) return dictNext();
  DC.done=true; DC.n++; const ok = norm($('#dcIn').value)===norm(DC.w[0]); if(ok){ DC.ok++; addXP(2); }
  $('#dcIn').classList.add(ok?'okIn':'badIn');
  $('#dcr').innerHTML = (ok?'✅ Верно! ':'❌ Правильно: ') + `<b class="word" style="font-size:22px">${DC.w[0]}</b> ${ipa(DC.w[1])} — ${DC.w[2]}
   <button class="primary" onclick="dictNext()">Дальше →</button>`;
}

/* ---- неправильные глаголы ---- */
let IR = null;
function irrEnter(){
  const v = pick(IRREG); IR = {v, done:false, n:(IR?IR.n:0), ok:(IR?IR.ok:0)};
  const i = R(v[0]+', '+v[1].replace(' / ',', ')+', '+v[2]);
  $('#wBody').innerHTML = `<h2>Неправильные глаголы</h2>
   <div class="mut">Прошедшее время (Past Simple) и причастие (Participle II) у этих глаголов образуются не по правилу — их запоминают. Счёт: ${IR.ok} из ${IR.n}</div>
   <div class="card"><div class="center"><span class="word big">${v[0]}</span><div>${v[3]}</div></div>
    <label class="mut" for="irA">Прошедшее (2-я форма)</label><input type="text" id="irA" autocomplete="off" autocapitalize="off" spellcheck="false">
    <label class="mut" for="irB">Причастие (3-я форма)</label><input type="text" id="irB" autocomplete="off" autocapitalize="off" spellcheck="false" onkeydown="if(event.key==='Enter')irrCheck()">
    <button class="primary" onclick="irrCheck()">Проверить</button><div id="irr" class="res"></div></div>
   <details class="card"><summary><b>Таблица всех ${IRREG.length} глаголов</b></summary><div class="tw"><table>
    <tr><th>Глагол</th><th>Прошедшее</th><th>Причастие</th><th>Перевод</th></tr>
    ${IRREG.map(x=>{ const k=R(x[0]+', '+x[1].replace(' / ',', ')+', '+x[2]); return `<tr onclick="sayI(${k})" style="cursor:pointer"><td><b>${x[0]}</b></td><td>${x[1]}</td><td>${x[2]}</td><td>${x[3]}</td></tr>`; }).join('')}
   </table></div></details>`;
  IR.say = i;
}
function irrCheck(){
  if(IR.done) return irrEnter();
  IR.done=true; IR.n++;
  const a = norm($('#irA').value), b = norm($('#irB').value), v = IR.v;
  const okA = v[1].split(' / ').some(x=>norm(x)===a), okB = norm(v[2])===b, ok = okA && okB;
  if(ok){ IR.ok++; addXP(2); }
  $('#irA').classList.add(okA?'okIn':'badIn'); $('#irB').classList.add(okB?'okIn':'badIn');
  sayI(IR.say);
  $('#irr').innerHTML = (ok?'✅ Верно! ':'❌ ') + `<b>${v[0]} — ${v[1]} — ${v[2]}</b><button class="primary" onclick="irrEnter()">Дальше →</button>`;
}

/* ---- весь словарь ---- */
function allWords(){
  $('#wBody').innerHTML = `<div class="seg">${[[0,'Все'],[1,'A1'],[2,'A2'],[3,'Курс']].map(([k,l])=>`<button class="${DL===k?'on':''}" onclick="DL=${k};allWords()">${l}</button>`).join('')}</div>
   <input type="search" id="dsearch" placeholder="Поиск по-английски или по-русски" oninput="renderDict(this.value)" style="margin:8px 0">
   <div class="mut">● серый — новое, ● оранжевый — изучается, ● зелёный — выучено</div><div id="dict"></div>`;
  renderDict('');
}
function renderDict(f){
  const el = $('#dict'); if(!el) return; f = (f||'').trim().toLowerCase();
  el.innerHTML = WORDS.filter(w => !DL || w[3]===DL).filter(w => !f || w[0].toLowerCase().includes(f) || w[2].toLowerCase().includes(f))
    .map(w => { const s=S.srs[w[0]]; const cls = !s ? '' : (s.r>=1&&s.i>=3?'k':'l'); const i=R(w[0]);
      return `<div class="dict-row" onclick="sayI(${i})"><span class="dot ${cls}"></span><b class="word" style="min-width:110px">${w[0]}</b><span class="ipa" style="min-width:90px">${w[1]}</span><span>${w[2]}</span></div>`; }).join('');
}
