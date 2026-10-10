'use strict';
/* ===== ЗВУКИ И ПРАВИЛА ЧТЕНИЯ ===== */
function renderSounds(){
  const sub = S.sub.sounds || 'snd';
  $('#t-sounds').innerHTML = subnav('sounds', [['snd','Трудные звуки'],['pair','Различи на слух'],['rules','Правила чтения'],['abc','Алфавит']], sub) + '<div id="sndBody"></div>';
  ({snd:soundsList, pair:pqNext, rules:readRules, abc:alphabet})[sub]();
}
function wordBtn(w){ const i=R(w); return `<button class="btn" onclick="sayI(${i})">${w} 🔊</button>`; }
function soundsList(){
  $('#sndBody').innerHTML = `<h2>Трудные звуки</h2>
   <div class="mut">В английском есть звуки, которых нет в русском. Нажимайте на слова, слушайте и повторяйте вслух, глядя в зеркало.</div>
   ${SOUNDS.map(s=>`<div class="card"><b class="acc">${s[0]}</b><div>${s[1]}</div><div class="row" style="margin-top:6px">${s[2].map(wordBtn).join('')}</div></div>`).join('')}
   <div class="card"><b>Ударение</b><div>В транскрипции знак <b>ˈ</b> стоит <b>перед</b> ударным слогом: teacher [ˈtiːtʃə] — ударение на первый слог, hotel [həʊˈtel] — на второй. Знак <b>ː</b> — долгий звук.</div></div>`;
}
let PQ = null;
function pqNext(){
  const p = pick(PAIRS), k = Math.random()*2|0;
  PQ = {p, k, done:false};
  $('#sndBody').innerHTML = `<h2>Различи на слух</h2><div class="mut">Слова отличаются одним звуком. Какое прозвучало? Точность: ${S.snd.all?Math.round(S.snd.ok/S.snd.all*100):0}% (${S.snd.ok}/${S.snd.all})</div>
   <div class="card"><div class="center"><button class="huge" onclick="say(PQ.p[PQ.k])" aria-label="Послушать">🔊</button></div>
   <div class="opts" id="pqo">${p.map((x,i)=>`<button onclick="pqAns(${i})">${x}</button>`).join('')}</div><div class="res" id="pqr"></div></div>`;
  setTimeout(()=>say(p[k]),250);
}
function pqAns(i){
  if(PQ.done) return; PQ.done=true; const ok=i===PQ.k; S.snd.all++; if(ok){ S.snd.ok++; addXP(1); } save();
  const bs=document.querySelectorAll('#pqo button'); bs[PQ.k].classList.add('ok'); if(!ok) bs[i].classList.add('bad');
  const tr = w => { const x = WORDS.find(v=>v[0]===w); return x ? ' '+ipa(x[1])+' — '+x[2] : ''; };
  $('#pqr').innerHTML = (ok?'✅ Верно!':'❌ Прозвучало <b>'+PQ.p[PQ.k]+'</b>')
   + `<div class="mut" style="margin-top:4px"><b>${PQ.p[0]}</b>${tr(PQ.p[0])}<br><b>${PQ.p[1]}</b>${tr(PQ.p[1])}</div>
   <div class="row" style="margin-top:6px"><button class="btn" onclick="sayQueue([{t:PQ.p[0]},{t:PQ.p[1]}])">🔊 Оба по очереди</button><button class="btn" style="font-weight:600" onclick="pqNext()">Дальше →</button></div>`;
}
function readRules(){
  $('#sndBody').innerHTML = `<h2>Правила чтения</h2>
   <div class="mut">Английские слова читаются не по буквам, но есть правила, которые работают в большинстве слов. Сначала прочитайте слово сами, потом нажмите и проверьте.</div>
   ${READRULES.map(r=>`<div class="card"><b class="acc">${r[0]}</b><div>${r[1]}</div><div class="row" style="margin-top:6px">${r[2].map(wordBtn).join('')}</div></div>`).join('')}`;
}
const ABC = [['A','eɪ'],['B','biː'],['C','siː'],['D','diː'],['E','iː'],['F','ef'],['G','dʒiː'],['H','eɪtʃ'],['I','aɪ'],['J','dʒeɪ'],['K','keɪ'],['L','el'],['M','em'],
 ['N','en'],['O','əʊ'],['P','piː'],['Q','kjuː'],['R','ɑː'],['S','es'],['T','tiː'],['U','juː'],['V','viː'],['W','ˈdʌbljuː'],['X','eks'],['Y','waɪ'],['Z','zed']];
function alphabet(){
  $('#sndBody').innerHTML = `<h2>Алфавит</h2><div class="mut">26 букв. Названия букв пригодятся, чтобы продиктовать имя или адрес по буквам. Z в британском — [zed], в американском — [ziː].</div>
   <div class="grid" style="margin-top:8px">${ABC.map(a=>{ const i=R(a[0]); return `<div class="tile" onclick="sayI(${i})"><div class="word" style="font-size:34px">${a[0]}${a[0].toLowerCase()}</div>${ipa(a[1])}</div>`; }).join('')}</div>
   <div class="card"><b>Продиктуй по буквам</b><div class="mut">Введите своё имя — программа произнесёт его по буквам.</div>
    <div class="row" style="margin-top:6px"><input type="text" id="spellIn" placeholder="Anna" style="flex:1" maxlength="30">
    <button class="btn" onclick="say(($('#spellIn').value||'Anna').toUpperCase().split('').filter(c=>/[A-Z]/.test(c)).join(', '))">🔊 По буквам</button></div></div>`;
}
