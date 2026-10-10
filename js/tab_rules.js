'use strict';
/* ===== ПРАВИЛА: грамматика и числа ===== */
function renderRules(){
  const sub = S.sub.rules || 'gram';
  $('#t-rules').innerHTML = subnav('rules', [['gram','Грамматика'],['num','Числа, время, деньги']], sub) + '<div id="rulesBody"></div>';
  if(sub==='num') numEnter(); else if(GL!==null) renderLesson(); else renderGrammarList();
}

/* ---- уроки грамматики ---- */
let GL = null, GB = null;
function renderGrammarList(){
  const done = GRAMMAR.filter((g,i)=>S.gram[i]).length;
  $('#rulesBody').innerHTML = `<h2>Грамматика</h2>
   <div class="mut">Главное отличие от русского: строгий порядок слов и вспомогательные глаголы. Пройдено уроков: ${done} из ${GRAMMAR.length}.</div>
   ${GRAMMAR.map((g,i)=>`<div class="card row" style="justify-content:space-between;flex-wrap:nowrap;cursor:pointer" onclick="GL=${i};renderLesson()">
     <span><span class="mut">Урок ${i+1}</span><br><b>${g.t}</b></span><span>${S.gram[i]?'✅':'→'}</span></div>`).join('')}`;
}
function renderLesson(){
  const g = GRAMMAR[GL];
  $('#rulesBody').innerHTML = `<div class="row" style="justify-content:space-between;margin-top:8px"><button class="btn" onclick="GL=null;GB=null;renderGrammarList()">← Все уроки</button><span class="mut">Урок ${GL+1} из ${GRAMMAR.length}</span></div>
   <h2>${g.t}</h2><div class="card">${g.x}</div>
   ${g.ex.map(e=>`<div class="card"><div class="en mid">${e[0]}</div><div>${e[1]}</div><div class="row" style="margin-top:4px">${audioBtns(e[0])}</div></div>`).join('')}
   <h3>Собери предложение</h3><div class="card" id="gb"></div>`;
  gbStart(0);
}
function gbStart(bi){
  const w = GRAMMAR[GL].b[bi][0];
  let order = shuffle(w.map((x,i)=>i)), guard=0;
  while(order.every((x,i)=>x===i) && w.length>1 && guard++<10) order = shuffle(order);
  GB = {bi, picked:[], order, done:false};
  gbRender();
}
function gbRender(){
  const g = GRAMMAR[GL], b = g.b[GB.bi], w = b[0];
  $('#gb').innerHTML = `<div class="mut">Задание ${GB.bi+1} из ${g.b.length}. Составьте по-английски:</div>
   <div style="font-size:20px;margin:6px 0">«${b[1]}»</div>
   <div class="ans">${GB.picked.map((k,j)=>`<button class="tile2" onclick="gbUndo(${j})">${w[k]}</button>`).join('') || '<span class="mut">нажимайте на слова ниже по порядку</span>'}</div>
   <div class="row" style="margin-top:8px">${GB.order.filter(k=>!GB.picked.includes(k)).map(k=>`<button class="tile2" onclick="gbPick(${k})">${w[k]}</button>`).join('')}</div>
   <div class="res" id="gbr"></div>
   ${GB.picked.length===w.length && !GB.done ? '<button class="primary" onclick="gbCheck()">Проверить</button>' : ''}`;
}
function gbPick(k){ if(GB.done) return; GB.picked.push(k); gbRender(); }
function gbUndo(j){ if(GB.done) return; GB.picked.splice(j,1); gbRender(); }
function gbCheck(){
  const g = GRAMMAR[GL], b = g.b[GB.bi], w = b[0];
  const got = GB.picked.map(k=>w[k]).join(' '), right = w.join(' ');
  const ok = norm(got)===norm(right) || (b[2]||[]).some(a=>norm(a)===norm(got));
  GB.done = true; gbRender();
  const last = GB.bi+1 >= g.b.length, end = /\?$/.test(b[1]) ? '?' : '.';
  if(ok){ addXP(3); say(got+end); if(last){ S.gram[GL]=1; save(); } }
  const ri = R(right+end);
  $('#gbr').innerHTML = (ok ? '<b style="color:var(--ok)">✅ Верно!</b> ' : '<b style="color:var(--bad)">❌ Правильно так:</b> ')
    + `<span class="en" style="font-size:20px">${right}${end}</span> <button class="btn" onclick="sayI(${ri})">🔊</button>`
    + `<div class="row" style="margin-top:6px">${ok?'':'<button class="btn" onclick="gbStart(GB.bi)">Ещё раз</button>'}`
    + (last ? (GL+1<GRAMMAR.length ? `<button class="btn" style="font-weight:600" onclick="GL++;renderLesson();window.scrollTo(0,0)">Следующий урок →</button>` : '<span>🎉 Все уроки пройдены!</span>')
            : `<button class="btn" style="font-weight:600" onclick="gbStart(${GB.bi+1})">Следующее задание →</button>`) + '</div>';
}

/* ---- числа, время, деньги, даты ---- */
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_RU = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const WEEK = [['Monday','понедельник'],['Tuesday','вторник'],['Wednesday','среда'],['Thursday','четверг'],['Friday','пятница'],['Saturday','суббота'],['Sunday','воскресенье']];
const NUM_KINDS = [['n1','0–100'],['n2','100–9999'],['price','Цены'],['time','Время'],['date','Даты'],['year','Годы'],['week','Дни недели']];
function numItem(kind){
  if(kind==='n1'){ const n=rnd(0,100); return {en:numEn(n), show:String(n)}; }
  if(kind==='n2'){ const n=rnd(100,9999); return {en:numEn(n), show:String(n)}; }
  if(kind==='price'){ const p=rnd(1,99), c=pick([0,0,50,rnd(1,99)]);
    return {en:numEn(p)+(p===1?' pound':' pounds')+(c?' '+numEn(c):''), show:'£'+p+(c?'.'+String(c).padStart(2,'0'):'')}; }
  if(kind==='time'){ const h=rnd(1,12), m=pick([0,15,30,45,5,10,20,25,40,50,55,rnd(1,59)]); return {en:timeEn(h,m), show:h+':'+String(m).padStart(2,'0')}; }
  if(kind==='date'){ const mo=rnd(0,11), d=rnd(1,28); return {en:'the '+ordEn(d)+' of '+MONTHS_EN[mo], show:d+' '+MONTHS_RU[mo]}; }
  if(kind==='year'){ const y=pick([rnd(1950,1999),rnd(2000,2009),rnd(2010,2030)]); return {en:yearEn(y), show:String(y)}; }
  const w = pick(WEEK); return {en:w[0], show:w[1]};
}
let NQ = null;
function numEnter(){
  const k = S.sub.numk || 'n1', m = S.sub.numm || 'hear';
  $('#rulesBody').innerHTML = `<h2>Числа, время, деньги</h2>
   <div class="card mut">13–19 оканчиваются на <b>-teen</b> (ударение на конце: thirTEEN), десятки — на <b>-ty</b> (ударение в начале: THIRty) — их легко спутать на слух.
    105 = one hundred <b>and</b> five. Время: <b>past</b> — «после», <b>to</b> — «до», <b>half</b> — половина, <b>quarter</b> — четверть: 3:15 — quarter past three, 3:45 — quarter to four.
    Дата: <b>the fifth of May</b>. Год: 1990 — nineteen ninety, 2026 — twenty twenty-six.</div>
   <div class="seg">${NUM_KINDS.map(([kk,l])=>`<button class="${kk===k?'on':''}" onclick="S.sub.numk='${kk}';save();numEnter()">${l}</button>`).join('')}</div>
   <div class="seg"><button class="${m==='hear'?'on':''}" onclick="S.sub.numm='hear';save();numEnter()">👂 Услышь</button><button class="${m==='say'?'on':''}" onclick="S.sub.numm='say';save();numEnter()">🗣 Скажи</button></div>
   <div class="card" id="nq"></div>`;
  numNext();
}
function numNext(){
  const k = S.sub.numk || 'n1', m = S.sub.numm || 'hear', it = numItem(k);
  const opts = [it];
  if(k==='n1'){ const n=+it.show; const twin = n>=13&&n<=19 ? (n-10)*10 : (n>=30&&n<=90&&n%10===0) ? n/10+10 : null;
    if(twin) opts.push({en:numEn(twin), show:String(twin)}); }
  let guard=0; while(opts.length<4 && guard++<50){ const o=numItem(k); if(!opts.some(x=>x.show===o.show)) opts.push(o); }
  NQ = {it, opts:shuffle(opts), done:false, n:(NQ?NQ.n:0), ok:(NQ?NQ.ok:0)};
  if(m==='hear'){
    $('#nq').innerHTML = `<div class="center"><button class="huge" onclick="say(NQ.it.en)" aria-label="Послушать">🔊</button><div class="mut" style="margin-top:6px">Что прозвучало? Счёт: ${NQ.ok} из ${NQ.n}</div></div>
     <div class="opts" id="nqo">${NQ.opts.map((o,i)=>`<button onclick="numAns(${i})">${o.show}</button>`).join('')}</div><div class="res" id="nqr"></div>`;
    setTimeout(()=>say(it.en),250);
  } else {
    $('#nq').innerHTML = `<div class="center"><div class="mut">Скажите по-английски:</div><div style="font-size:40px;font-weight:700;margin:8px 0">${it.show}</div>
     <div class="row" style="justify-content:center"><button class="btn" onclick="numReveal()">Проверить себя</button><button class="btn" onclick="listen(NQ.it.en,'nqm')">🎤</button></div>
     <div id="nqr" class="res"></div><div id="nqm" class="res"></div></div>`;
  }
}
function numReveal(){
  if(!NQ.done){ NQ.done=true; NQ.n++; NQ.ok++; addXP(1); }
  say(NQ.it.en);
  $('#nqr').innerHTML = `<div class="en mid">${NQ.it.en}</div><button class="primary" onclick="numNext()">Дальше →</button>`;
}
function numAns(i){
  if(NQ.done) return; NQ.done=true; NQ.n++;
  const right = NQ.opts.indexOf(NQ.it), ok = i===right; if(ok){ NQ.ok++; addXP(1); }
  const bs = document.querySelectorAll('#nqo button'); bs[right].classList.add('ok'); if(!ok) bs[i].classList.add('bad');
  $('#nqr').innerHTML = `<div class="center en" style="font-size:20px">${NQ.it.en}</div>
   <div class="row" style="justify-content:center"><button class="btn" onclick="say(NQ.it.en,0.6)">🐢 медленно</button></div>
   <button class="primary" onclick="numNext()">Дальше →</button>`;
}
