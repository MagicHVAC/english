'use strict';
/* ===== Язык для курса: как показывать фразы и делить их на слова ===== */
const LANG = {
  code:'en', name:'по-английски',
  big: it => `<div class="en mid">${it.t}</div>`,
  word: w => `<b class="word" style="font-size:24px">${w[0]}</b> ${ipa(w[1])}`,
  tok: t => t.replace(/[.,!?]/g,'').split(/\s+/).filter(Boolean),
  join: a => a.join(' '),
  same: (a, b) => norm(a.replace(/[.,!?"]/g,'')) === norm(b.replace(/[.,!?"]/g,''))
};
