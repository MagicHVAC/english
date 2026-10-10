'use strict';
/* ===== Трудные звуки для русскоговорящих: [звук, как произносить, примеры] ===== */
const SOUNDS = [
 ['[θ] th','Глухой: кончик языка между зубами, выдыхайте. Не «с» и не «ф».',['think','three','thank you']],
 ['[ð] th','Звонкий: язык между зубами и голос. Не «з».',['this','mother','the']],
 ['[w] w','Губы трубочкой, как для «у», и быстро раскрыть. Не «в».',['we','water','window']],
 ['[v] v','Обычное «в»: верхние зубы на нижней губе.',['very','visit','live']],
 ['[h] h','Лёгкий выдох, как на запотевшее стекло. Не «х».',['hello','house','happy']],
 ['[r] r','Язык не дрожит: кончик загнут назад и не касается нёба.',['red','right','sorry']],
 ['[ŋ] ng','Носовой звук: спинка языка у нёба, «г» на конце не слышно.',['sing','long','morning']],
 ['[æ] a','Широкое «э»: рот раскрыт, как для «а».',['cat','bad','apple']],
 ['[e] e','Узкое «э», как в слове «это».',['bed','pen','red']],
 ['[ɪ] и [iː]','Короткое, почти «ы» — и долгое «ии». Долгота меняет смысл.',['ship','sheep','sit']],
 ['[ʊ] и [uː]','Короткое «у» без вытягивания губ — и долгое «уу».',['book','food','good']],
 ['[ʌ] u','Короткое «а», как безударное в слове «вода».',['cup','but','mother']],
 ['[ɜː] ir, er, ur','Похоже на «ё» без «й», губы не округлять.',['bird','girl','work']],
 ['[ə] шва','Безударный, очень короткий нейтральный звук.',['teacher','about','banana']],
 ['Звонкие на конце','В английском конечные согласные НЕ оглушаются: bed ≠ bet, bag ≠ back.',['bed','bet','bag']],
 ['[p] [t] [k]','В начале слова — с лёгким выдохом-придыханием.',['pen','ten','key']]
];
/* Пары слов, различающиеся одним звуком */
const PAIRS = [
 ['ship','sheep'],['sit','seat'],['live','leave'],['full','fool'],['cat','cut'],['cap','cup'],['bed','bad'],['pen','pan'],['man','men'],
 ['think','sink'],['three','tree'],['thin','tin'],['mouth','mouse'],['vine','wine'],['west','vest'],['hat','had'],['bag','back'],
 ['walk','work'],['hot','hut'],['sing','sin']
];
/* Правила чтения: [правило, объяснение, примеры] */
const READRULES = [
 ['Открытый слог: «немая» e на конце','Гласная читается как в алфавите, а e в конце не читается.',['make','time','home','cute','Pete']],
 ['Закрытый слог','Гласная + согласная в конце: короткий звук.',['cat','pet','sit','hot','cup']],
 ['ee, ea → [iː]','Долгое «ии».',['see','tea','meet','read']],
 ['oo → [uː] или [ʊ]','Обычно долгое, перед k и в good — короткое.',['food','moon','book','good']],
 ['ai, ay → [eɪ]','«эй».',['rain','day','play','wait']],
 ['ou, ow → [aʊ]','«ау». Но ow на конце часто [əʊ]: snow, window.',['house','now','town','snow']],
 ['ar → [ɑː], or → [ɔː]','Долгие «аа» и «оо»; r после гласной в британском не читается.',['car','park','fork','short']],
 ['er, ir, ur → [ɜː]','Один звук для трёх сочетаний.',['her','girl','turn','bird']],
 ['sh, ch, ph, wh','sh [ʃ], ch [tʃ], ph [f], wh [w] (но who — [h]).',['ship','chair','phone','what']],
 ['th → [θ] или [ð]','Глухой в знаменательных словах, звонкий в служебных.',['think','three','this','the']],
 ['ck, kn, wr','ck → [k]; в kn не читается k, в wr не читается w.',['back','know','write','knife']],
 ['c и g перед e, i, y','c → [s], g часто → [dʒ]; в остальных случаях [k] и [ɡ].',['city','nice','cat','page','go']],
 ['igh → [aɪ]','gh не читается.',['night','light','right','high']],
 ['-tion → [ʃn]','«шн» на конце.',['station','question','action']],
 ['y на конце','В односложных → [aɪ], в многосложных → [i].',['my','fly','happy','city']]
];

/* ===== Фразы ===== */
const PHRASES = [
 ['Знакомство',[
  ['Hello! How are you?','Привет! Как дела?'],['I\'m fine, thanks. And you?','Хорошо, спасибо. А у тебя?'],
  ['What\'s your name?','Как тебя зовут?'],['My name is Anna.','Меня зовут Анна.'],['Nice to meet you.','Приятно познакомиться.'],
  ['Where are you from?','Откуда ты?'],['I\'m from Russia.','Я из России.'],['How old are you?','Сколько тебе лет?'],['I\'m twelve years old.','Мне двенадцать лет.']]],
 ['Вежливость',[
  ['Thank you very much!','Большое спасибо!'],['You\'re welcome.','Пожалуйста (в ответ на спасибо).'],['Excuse me.','Извините (чтобы обратиться).'],
  ['I\'m sorry.','Простите.'],['No problem.','Ничего страшного.'],['Have a nice day!','Хорошего дня!'],['See you later!','Увидимся!']]],
 ['Когда не понимаю',[
  ['Sorry, I don\'t understand.','Извините, я не понимаю.'],['Can you say that again, please?','Повторите, пожалуйста.'],
  ['Can you speak more slowly, please?','Говорите медленнее, пожалуйста.'],['What does this word mean?','Что значит это слово?'],
  ['How do you say it in English?','Как это сказать по-английски?'],['I speak a little English.','Я немного говорю по-английски.']]],
 ['Магазин и кафе',[
  ['How much is it?','Сколько это стоит?'],['I\'d like a cup of tea, please.','Чашку чая, пожалуйста.'],['Can I have the bill, please?','Можно счёт, пожалуйста?'],
  ['Can I pay by card?','Можно оплатить картой?'],['It\'s too expensive.','Это слишком дорого.'],['I\'ll take it.','Я возьму это.'],['Do you have it in a smaller size?','Есть размер поменьше?']]],
 ['Дорога и время',[
  ['Where is the station?','Где вокзал?'],['Go straight on and turn left.','Идите прямо и поверните налево.'],['Is it far from here?','Это далеко отсюда?'],
  ['What time is it?','Который час?'],['It\'s half past three.','Половина четвёртого.'],['What day is it today?','Какой сегодня день?'],['I\'m late. Sorry!','Я опоздал. Простите!']]]
];

/* ===== Диалоги: [кто, реплика, перевод] ===== */
const DIALOGS = [
 ['Знакомство',[
  ['A','Hi! I\'m Tom. What\'s your name?','Привет! Я Том. Как тебя зовут?'],['B','Hi, Tom! I\'m Anna.','Привет, Том! Я Анна.'],
  ['A','Nice to meet you, Anna. Where are you from?','Приятно познакомиться, Анна. Откуда ты?'],['B','I\'m from Moscow. And you?','Я из Москвы. А ты?'],
  ['A','I\'m from London.','Я из Лондона.'],['B','Cool! Nice to meet you too.','Здорово! Мне тоже приятно.']]],
 ['В кафе',[
  ['A','Hello! What would you like?','Здравствуйте! Что желаете?'],['B','A cup of tea and a piece of cake, please.','Чашку чая и кусочек торта, пожалуйста.'],
  ['A','Anything else?','Что-нибудь ещё?'],['B','No, thank you. How much is it?','Нет, спасибо. Сколько с меня?'],
  ['A','That\'s five pounds fifty.','Пять фунтов пятьдесят.'],['B','Here you are.','Вот, пожалуйста.'],['A','Thank you. Enjoy!','Спасибо. Приятного аппетита!']]],
 ['В магазине одежды',[
  ['A','Can I help you?','Вам помочь?'],['B','Yes, please. I\'m looking for a jacket.','Да, пожалуйста. Я ищу куртку.'],
  ['A','What size are you?','Какой у вас размер?'],['B','Medium, I think. Can I try this one on?','Думаю, средний. Можно примерить эту?'],
  ['A','Of course. The changing room is over there.','Конечно. Примерочная вон там.'],['B','It\'s perfect. I\'ll take it!','Идеально. Беру!']]],
 ['Как пройти?',[
  ['A','Excuse me, where is the nearest bank?','Извините, где ближайший банк?'],['B','Go straight on and turn right at the park.','Идите прямо и у парка поверните направо.'],
  ['A','Is it far?','Это далеко?'],['B','No, it\'s about five minutes on foot.','Нет, примерно пять минут пешком.'],
  ['A','Thank you very much!','Большое спасибо!'],['B','You\'re welcome.','Пожалуйста.']]],
 ['Моя семья',[
  ['A','Have you got any brothers or sisters?','У тебя есть братья или сёстры?'],['B','Yes, I\'ve got a brother. He\'s sixteen.','Да, у меня есть брат. Ему шестнадцать.'],
  ['A','What does your mum do?','Кем работает твоя мама?'],['B','She\'s a doctor. And my dad is an engineer.','Она врач. А папа — инженер.'],
  ['A','Have you got a pet?','У тебя есть питомец?'],['B','Yes, a cat. Her name is Murka.','Да, кошка. Её зовут Мурка.']]],
 ['Планы на выходные',[
  ['A','What are you doing this weekend?','Что ты делаешь в эти выходные?'],['B','I\'m going to the cinema on Saturday.','В субботу я иду в кино.'],
  ['A','Can I come with you?','Можно с тобой?'],['B','Sure! The film starts at seven.','Конечно! Фильм начинается в семь.'],
  ['A','Great. Let\'s meet at half past six.','Отлично. Давай встретимся в половине седьмого.'],['B','OK, see you then!','Хорошо, до встречи!']]],
 ['Погода',[
  ['A','What\'s the weather like today?','Какая сегодня погода?'],['B','It\'s cold and it\'s raining.','Холодно и идёт дождь.'],
  ['A','Oh no! And tomorrow?','О нет! А завтра?'],['B','Tomorrow it will be sunny and warm.','Завтра будет солнечно и тепло.']]],
 ['У врача',[
  ['A','Hello. What\'s the matter?','Здравствуйте. Что случилось?'],['B','I\'ve got a headache and a sore throat.','У меня болит голова и горло.'],
  ['A','Have you got a temperature?','У вас есть температура?'],['B','Yes, a little.','Да, небольшая.'],
  ['A','Stay in bed and drink a lot of water.','Оставайтесь в постели и пейте много воды.'],['B','Thank you, doctor.','Спасибо, доктор.']]]
];

/* ===== Тексты для чтения: [название, [[английский, русский]...]] ===== */
const TEXTS = [
 ['My family',[['My name is Kate.','Меня зовут Кейт.'],['I am eleven years old.','Мне одиннадцать лет.'],['I live in a small house with my family.','Я живу в небольшом доме со своей семьёй.'],
  ['My mother is a teacher and my father is a doctor.','Моя мама учитель, а папа врач.'],['I have got a brother. His name is Sam.','У меня есть брат. Его зовут Сэм.'],
  ['We have got a dog. It is big and friendly.','У нас есть собака. Она большая и дружелюбная.'],['I love my family!','Я люблю свою семью!']]],
 ['My day',[['I get up at seven o\'clock.','Я встаю в семь часов.'],['I have breakfast with my mum.','Я завтракаю с мамой.'],['I go to school by bus.','Я езжу в школу на автобусе.'],
  ['Lessons start at half past eight.','Уроки начинаются в половине девятого.'],['After school I do my homework.','После школы я делаю домашнее задание.'],
  ['In the evening I read a book or watch TV.','Вечером я читаю книгу или смотрю телевизор.'],['I go to bed at ten.','Я ложусь спать в десять.']]],
 ['My room',[['This is my room.','Это моя комната.'],['It is not big, but it is nice.','Она небольшая, но уютная.'],['There is a bed near the window.','У окна стоит кровать.'],
  ['There is a desk and a chair.','Есть письменный стол и стул.'],['My computer is on the desk.','Мой компьютер на столе.'],['There are many books on the shelf.','На полке много книг.']]],
 ['At the shop',[['Today I am at the shop with my dad.','Сегодня я в магазине с папой.'],['We want to buy food for dinner.','Мы хотим купить еду на ужин.'],
  ['We buy bread, cheese, eggs and apples.','Мы покупаем хлеб, сыр, яйца и яблоки.'],['My dad wants some coffee too.','Папа хочет ещё кофе.'],
  ['It costs twelve pounds.','Это стоит двенадцать фунтов.'],['Dad pays by card.','Папа платит картой.']]],
 ['My best friend',[['My best friend is Lily.','Моя лучшая подруга — Лили.'],['She is tall and she has got long brown hair.','Она высокая, у неё длинные каштановые волосы.'],
  ['She is very kind and funny.','Она очень добрая и весёлая.'],['We go to the same school.','Мы ходим в одну школу.'],['At the weekend we play games and listen to music.','На выходных мы играем и слушаем музыку.']]],
 ['The weekend',[['Last weekend was great.','Прошлые выходные были отличными.'],['On Saturday we went to the park.','В субботу мы ходили в парк.'],
  ['The weather was warm and sunny.','Погода была тёплой и солнечной.'],['We played football and ate ice cream.','Мы играли в футбол и ели мороженое.'],
  ['On Sunday I visited my grandmother.','В воскресенье я навестила бабушку.'],['She made a delicious cake.','Она испекла очень вкусный торт.']]],
 ['A trip to London',[['Next summer my family is going to visit London.','Следующим летом моя семья собирается в Лондон.'],['We are going to fly there by plane.','Мы полетим туда на самолёте.'],
  ['We will see Big Ben and the London Eye.','Мы увидим Биг-Бен и колесо обозрения «Лондонский глаз».'],['I want to take a lot of photos.','Я хочу сделать много фотографий.'],
  ['I hope the weather will be good.','Надеюсь, погода будет хорошей.']]],
 ['Seasons',[['There are four seasons in a year.','В году четыре времени года.'],['In winter it is cold and it often snows.','Зимой холодно и часто идёт снег.'],
  ['In spring the trees are green.','Весной деревья зелёные.'],['Summer is hot. Children have long holidays.','Летом жарко. У детей длинные каникулы.'],
  ['In autumn it rains a lot.','Осенью часто идёт дождь.'],['My favourite season is summer.','Моё любимое время года — лето.']]]
];

/* ===== Грамматика: t — тема, x — объяснение, ex — [англ, рус], b — «собери предложение» [слова, перевод, другие верные варианты] ===== */
const GRAMMAR = [
 {t:'Глагол to be: am, is, are', x:'В английском в каждом предложении нужен глагол. «Я ученик» = I <b>am</b> a student. I → <b>am</b>; he, she, it → <b>is</b>; you, we, they → <b>are</b>. Сокращения: I\'m, he\'s, they\'re.',
  ex:[['I am a student.','Я ученик.'],['She is happy.','Она счастлива.'],['They are at home.','Они дома.']],
  b:[[['I','am','a','student'],'Я ученик.'],[['She','is','my','sister'],'Она моя сестра.'],[['We','are','friends'],'Мы друзья.']]},
 {t:'Вопрос и отрицание с to be', x:'Вопрос: глагол вперёд — <b>Are</b> you ready? Отрицание: <b>not</b> после глагола — I am <b>not</b> tired, he <b>isn\'t</b>, they <b>aren\'t</b>.',
  ex:[['Are you a teacher?','Вы учитель?'],['He isn\'t at school.','Его нет в школе.']],
  b:[[['Are','you','ready'],'Ты готов?'],[['Is','she','your','mother'],'Она твоя мама?'],[['I','am','not','hungry'],'Я не голоден.']]},
 {t:'Артикли a / an / the', x:'<b>a</b> (перед согласным звуком) и <b>an</b> (перед гласным звуком) — «какой-то один»: a dog, an apple. <b>the</b> — «тот самый, известный»: the sun, the dog in the garden.',
  ex:[['I have got a cat.','У меня есть кошка.'],['I want an apple.','Я хочу яблоко.'],['The cat is black.','Эта кошка чёрная.']],
  b:[[['I','want','an','apple'],'Я хочу яблоко.'],[['This','is','a','book'],'Это книга.'],[['The','sun','is','hot'],'Солнце горячее.']]},
 {t:'Множественное число', x:'Обычно + <b>s</b>: book → books. После s, sh, ch, x → <b>es</b>: bus → buses. Согласная + y → <b>ies</b>: city → cities. Исключения: man → men, woman → women, child → children, foot → feet.',
  ex:[['two cats','две кошки'],['three boxes','три коробки'],['many children','много детей']],
  b:[[['I','have','two','brothers'],'У меня два брата.'],[['The','children','are','in','the','park'],'Дети в парке.']]},
 {t:'have got — «у меня есть»', x:'«У меня есть» = I <b>have got</b> (I\'ve got). He, she, it — <b>has got</b>. Вопрос: <b>Have</b> you got…? Отрицание: I <b>haven\'t got</b>.',
  ex:[['I have got a dog.','У меня есть собака.'],['She has got blue eyes.','У неё голубые глаза.'],['Have you got a pen?','У тебя есть ручка?']],
  b:[[['I','have','got','a','dog'],'У меня есть собака.'],[['She','has','got','a','sister'],'У неё есть сестра.'],[['Have','you','got','a','pen'],'У тебя есть ручка?']]},
 {t:'Present Simple: обычно, всегда', x:'Привычки и факты: I <b>play</b> football. С he, she, it к глаголу добавляем <b>-s</b>: she <b>plays</b>, he <b>watches</b>. Слова-подсказки: always, usually, often, every day.',
  ex:[['I live in Moscow.','Я живу в Москве.'],['He plays football every day.','Он играет в футбол каждый день.']],
  b:[[['I','live','in','Moscow'],'Я живу в Москве.'],[['She','likes','ice','cream'],'Она любит мороженое.'],[['He','plays','football','every','day'],'Он играет в футбол каждый день.']]},
 {t:'Present Simple: вопросы и отрицания', x:'Помощник <b>do</b> (с he, she, it — <b>does</b>, а -s у глагола пропадает). Вопрос: <b>Do</b> you like tea? <b>Does</b> she speak English? Отрицание: I <b>don\'t</b> know, he <b>doesn\'t</b> like.',
  ex:[['Do you like music?','Ты любишь музыку?'],['She doesn\'t eat meat.','Она не ест мясо.']],
  b:[[['Do','you','like','tea'],'Ты любишь чай?'],[['Does','he','speak','English'],'Он говорит по-английски?'],[['I','don\'t','like','coffee'],'Я не люблю кофе.']]},
 {t:'Present Continuous: прямо сейчас', x:'Действие в процессе: <b>am / is / are + глагол-ing</b>. I <b>am reading</b> now. Вопрос: <b>Are</b> you <b>sleeping</b>?',
  ex:[['I am reading a book now.','Я сейчас читаю книгу.'],['They are playing in the garden.','Они играют в саду.']],
  b:[[['I','am','reading','a','book'],'Я читаю книгу.'],[['She','is','watching','TV'],'Она смотрит телевизор.'],[['Are','you','sleeping'],'Ты спишь?']]},
 {t:'can — могу, умею', x:'<b>can</b> + глагол без to, одинаково для всех лиц: I can swim, she can swim. Отрицание <b>can\'t</b>, вопрос <b>Can</b> you…?',
  ex:[['I can swim.','Я умею плавать.'],['Can you help me?','Ты можешь мне помочь?'],['She can\'t dance.','Она не умеет танцевать.']],
  b:[[['I','can','swim'],'Я умею плавать.'],[['Can','you','help','me'],'Можешь мне помочь?'],[['He','can\'t','speak','French'],'Он не говорит по-французски.']]},
 {t:'there is / there are — «есть, находится»', x:'Чтобы сказать, что где-то что-то есть: <b>there is</b> + один предмет, <b>there are</b> + много. Место обычно в конце: There is a cat <b>in the garden</b>.',
  ex:[['There is a book on the table.','На столе книга.'],['There are two windows in my room.','В моей комнате два окна.']],
  b:[[['There','is','a','cat','in','the','garden'],'В саду кошка.'],[['There','are','many','books','here'],'Здесь много книг.']]},
 {t:'Притяжательные слова и \'s', x:'my, your, his, her, its, our, their — «мой, твой, его…». «Мамина сумка» = mum<b>\'s</b> bag, «друг Тома» = Tom<b>\'s</b> friend.',
  ex:[['This is my brother.','Это мой брат.'],['It is Tom\'s bike.','Это велосипед Тома.']],
  b:[[['This','is','my','brother'],'Это мой брат.'],[['Her','name','is','Lily'],'Её зовут Лили.'],[['It','is','Tom\'s','bike'],'Это велосипед Тома.']]},
 {t:'Предлоги места и времени', x:'Место: <b>in</b> — внутри, <b>on</b> — на поверхности, <b>under</b> — под, <b>near</b> — рядом. Время: <b>at</b> seven, <b>on</b> Monday, <b>in</b> May / in summer.',
  ex:[['The cat is under the table.','Кошка под столом.'],['I get up at seven.','Я встаю в семь.'],['My birthday is in May.','Мой день рождения в мае.']],
  b:[[['The','cat','is','under','the','table'],'Кошка под столом.'],[['I','get','up','at','seven'],'Я встаю в семь.'],[['We','have','English','on','Monday'],'У нас английский в понедельник.']]},
 {t:'Past Simple: was / were', x:'Прошедшее от to be: I, he, she, it → <b>was</b>; you, we, they → <b>were</b>. Отрицание wasn\'t, weren\'t. Вопрос: <b>Were</b> you at home?',
  ex:[['I was at home yesterday.','Вчера я был дома.'],['They were happy.','Они были счастливы.']],
  b:[[['I','was','at','home','yesterday'],'Вчера я был дома.',['Yesterday I was at home']],[['Were','you','at','school'],'Ты был в школе?']]},
 {t:'Past Simple: что сделал', x:'Правильные глаголы + <b>-ed</b>: play → played. Неправильные запоминаем: go → <b>went</b>, see → <b>saw</b> (вкладка «Слова» → «Неправильные»). Вопрос и отрицание — через <b>did</b>, глагол в начальной форме: <b>Did</b> you go? I <b>didn\'t</b> go.',
  ex:[['I played football yesterday.','Вчера я играл в футбол.'],['We went to the park.','Мы ходили в парк.'],['Did you see the film?','Ты видел фильм?']],
  b:[[['We','went','to','the','park'],'Мы ходили в парк.'],[['Did','you','see','the','film'],'Ты видел фильм?'],[['I','didn\'t','go','to','school'],'Я не ходил в школу.']]},
 {t:'Будущее: will и going to', x:'<b>will</b> + глагол — решение сейчас, прогноз: I <b>will</b> help you. <b>going to</b> + глагол — план, намерение: I am <b>going to</b> visit London.',
  ex:[['I will call you tomorrow.','Я позвоню тебе завтра.'],['We are going to buy a car.','Мы собираемся купить машину.']],
  b:[[['I','will','help','you'],'Я тебе помогу.'],[['We','are','going','to','visit','London'],'Мы собираемся посетить Лондон.']]},
 {t:'Сравнение: -er, more, the most', x:'Короткие слова: big → bigg<b>er</b> → the bigg<b>est</b>. Длинные: <b>more</b> interesting → <b>the most</b> interesting. «Чем» = <b>than</b>. Исключения: good → better → the best, bad → worse → the worst.',
  ex:[['My brother is taller than me.','Мой брат выше меня.'],['This book is more interesting.','Эта книга интереснее.'],['It is the best day!','Это лучший день!']],
  b:[[['My','brother','is','taller','than','me'],'Мой брат выше меня.'],[['It','is','the','best','day'],'Это лучший день.']]}
];
