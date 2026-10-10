'use strict';
/* ===== ЧТЕНИЕ: тексты с переводом по нажатию ===== */
// Поиск слова в словаре с учётом окончаний: books → book, played → play, went → go
const IRR_FORMS = (() => { const m={}; IRREG.forEach(v => { v[1].split(' / ').concat([v[2]]).forEach(f => { if(!m[f]) m[f]=v[0]; }); }); return m; })();
// Служебные слова и слова из текстов, которых нет в словаре
const GLOSS = {a:'неопределённый артикль («один, какой-то»)', an:'неопределённый артикль перед гласным звуком', the:'определённый артикль («тот самый»)',
  am:'есть, являюсь (to be с I)', are:'есть, являются (to be)', is:'есть, является (to be)', has:'имеет (have с he, she, it)', will:'вспомогательный глагол будущего времени',
  of:'предлог: из, о; родительный падеж', for:'для, на', by:'на (транспорте); у, около', up:'вверх (get up — вставать)', lessons:'уроки', lesson:'урок',
  homework:'домашнее задание', desk:'письменный стол', shelf:'полка', saturday:'суббота', half:'половина', past:'после (о времени): half past — половина',
  ice:'лёд (ice cream — мороженое)', cream:'сливки (ice cream — мороженое)', next:'следующий', lot:'a lot of — много', trees:'деревья', tree:'дерево',
  seasons:'времена года', season:'время года', best:'самый лучший', tv:'телевизор', kate:'Кейт (имя)', sam:'Сэм (имя)', lily:'Лили (имя)', london:'Лондон', ben:'Big Ben — Биг-Бен'};
function lookup(raw){
  const w = raw.toLowerCase().replace(/[^a-z']/g,'').replace(/'s$/,'');
  const find = x => WORDS.find(v => v[0].toLowerCase()===x);
  const tries = [w, IRR_FORMS[w], w.replace(/s$/,''), w.replace(/es$/,''), w.replace(/ies$/,'y'), w.replace(/ed$/,''), w.replace(/d$/,''),
    w.replace(/ing$/,''), w.replace(/ing$/,'e'), w.replace(/(.)\1ing$/,'$1'), w.replace(/(.)\1ed$/,'$1'), w.replace(/ied$/,'y'), w.replace(/er$/,''), w.replace(/est$/,'')];
  for(const t of tries){ if(t){ const f = find(t); if(f) return f; } }
  return GLOSS[w] ? [w, '', GLOSS[w]] : null;
}
function wordTap(el){
  const w = el.textContent; say(w);
  const f = lookup(w);
  toast('<b>'+w+'</b> '+(f ? (f[0].toLowerCase()!==w.toLowerCase().replace(/[^a-z']/g,'') ? '→ '+f[0]+' ' : '')+ipa(f[1])+' — '+f[2] : '— нет в словаре'), 3500);
}
function tapText(s){ return s.split(/(\s+)/).map(p => /\s/.test(p) ? p : `<span class="tw2" onclick="wordTap(this)">${p.replace(/[.,!?]+$/,'')}</span>${(p.match(/[.,!?]+$/)||[''])[0]}`).join(''); }
let TXT = null, showTr = false;
function renderRead(){
  if(TXT!==null) return readText();
  $('#t-read').innerHTML = `<h2>Тексты для чтения</h2>
   <div class="mut">Короткие тексты из слов курса. Читайте вслух, нажимайте на незнакомые слова — появится перевод.</div>
   ${TEXTS.map((t,k)=>`<div class="card row" style="justify-content:space-between;cursor:pointer" onclick="TXT=${k};readText()"><span><b>${k+1}. ${t[0]}</b><br><span class="mut">${t[1].length} предложений</span></span><span>${(S.read||{})[k]?'✅':'→'}</span></div>`).join('')}`;
}
function readText(){
  const t = TEXTS[TXT], all = R(t[1].map(s=>s[0]).join(' '));
  $('#t-read').innerHTML = `<div class="row" style="justify-content:space-between;margin-top:8px"><button class="btn" onclick="stopSay();TXT=null;renderRead()">← Все тексты</button>
    <label><input type="checkbox" id="trChk" ${showTr?'checked':''} onchange="showTr=this.checked;readText()"> перевод</label></div>
   <h2>${t[0]}</h2>
   <div class="row"><button class="btn" onclick="sayI(${all})">▶ Прочитать весь текст</button><button class="btn" onclick="sayI(${all},0.65)">🐢 медленно</button><button class="btn" onclick="stopSay()">■</button></div>
   ${t[1].map((s,i)=>`<div class="card"><div class="en mid">${tapText(s[0])}</div><div class="mut" ${showTr?'':'hidden'} id="tr${i}">${s[1]}</div>
     <div class="row" style="margin-top:4px">${audioBtns(s[0], 'tm'+i)}${showTr?'':`<button class="btn" onclick="$('#tr${i}').hidden=false">Перевод</button>`}</div><div class="res" id="tm${i}"></div></div>`).join('')}
   <button class="primary" onclick="S.read=S.read||{};if(!S.read[TXT]){S.read[TXT]=1;addXP(5);}TXT=TXT+1<TEXTS.length?TXT+1:null;renderRead();window.scrollTo(0,0)">Прочитано ✓ ${TXT+1<TEXTS.length?'— следующий текст':''}</button>`;
}
