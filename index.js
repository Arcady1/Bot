process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const debug = require('./helper'); // подключение модуля - помощника
const myKeyboard = require('./keyboard'); // подключение созданной клавиатуры

const token = '1119527180:AAG0EODTNzz7WE0plnesGAayD02jNrq_kJE';
const bot = new TelegramBot(token, {
  polling: true
});

// при старте бота
bot.onText(/\/start/, msg => {
  let userId = msg.from.id;
  let textWelcome = 'Hello! WRITE HERE, WHAT DOES THIS BOT DO AND RULES';

  // появление клавиатуры
  bot.sendMessage(userId, textWelcome, {
    reply_markup: {
      keyboard: myKeyboard.startKb
    }
  });
})

// ф-ия реагирует на сообщение с клавиатуры
bot.on('message', msg => {
  let userId = msg.from.id;
  // ! ДЛЯ ОТЛАДКИ
  bot.sendMessage(userId, debug(msg));
  // !

  switch (msg.text) {
    case 'Start':
      // появление клавиатуры
      bot.sendMessage(userId, 'RULES', {
        reply_markup: {
          keyboard: myKeyboard.stopKb
        }
      });
      // если введен интервал работа - отдых
      bot.onText(/([1-9][0-9]*) ([1-9][0-9]*)/, function (msg, match) {
        let userId = msg.from.id;
        // ! ДЛЯ ОТЛАДКИ
        // bot.sendMessage(userId, debug(msg));
        bot.sendMessage(userId, debug(match));
        // !
        let work = match[1];
        let relax = match[2];

        // создание напоминания
        let note = {
          'usID': userId,
          'workTime': parseInt(work),
          'relaxTime': parseInt(relax)
        }

        let startDate = new Date(); // начальная дата
        let endDate = new Date(); // дата уведомления
        let currentPlus; // текущее надбавка к дате (зависит от того, работал ты или отдыхал)
        let timeToWork = true;

        currentPlus = note.workTime; // значение по умолчанию - длительность рабочего цикла
        endDate.setMinutes(startDate.getMinutes() + currentPlus); // установка конечной даты
        // объект, содержащий информацию для уведомления
        let infoObject = {
          'note': note,
          'startDate': startDate,
          'endDate': endDate,
          'timeToWork': timeToWork,
          'currentPlus': currentPlus
        }

        bot.sendMessage(note.usID, 'It is ' + startDate.getHours() + ':' + minuteFormat(startDate.getMinutes()) + "\n" + 'I will call you at ' + endDate.getHours() + ':' + minuteFormat(endDate.getMinutes()));
        checkCurTime(infoObject);
      })
      break;
    case 'Stop':
      // появление клавиатуры
      bot.sendMessage(userId, 'You stopped', {
        reply_markup: {
          keyboard: myKeyboard.startKb
        }
      });
      break;
      // default:
      // break;
  }
})

// ф-ия проверяет каждую секунду, не пора ли присылать уведомление
function checkCurTime(infoObject) {
  let currentDate = new Date();

  // если пришло время, присылать уведомление
  if ((currentDate.getHours() == infoObject.endDate.getHours()) && (currentDate.getMinutes() == infoObject.endDate.getMinutes())) {
    let word;

    if (infoObject.timeToWork == true) {
      infoObject.timeToWork = false;
      infoObject.currentPlus = infoObject.note.workTime;
      word = 'relax';
    }
    // 
    else {
      infoObject.timeToWork = true;
      infoObject.currentPlus = infoObject.note.relaxTime;
      word = 'work';
    }

    infoObject.startDate = currentDate;
    infoObject.endDate.setMinutes(infoObject.startDate.getMinutes() + infoObject.currentPlus);
    bot.sendMessage(infoObject.note.usID, 'It\'s time to ' + word + '!\nI will call you at ' + infoObject.endDate.getHours() + ':' + minuteFormat(infoObject.endDate.getMinutes()));
  }

  setTimeout(checkCurTime, 1000, infoObject);
}

// ф-ия дописывает ведущий 0 к минутам, если число состоит из одной цифры
function minuteFormat(minute) {
  if (Math.floor(minute / 10) == 0)
    return '0' + minute;
  else
    return minute;
}

// ! Включить VPN
// TODO: реагирование на некорректный ввод и вывод ПОДСКАЗКИ (как вводить, min - 1 мин, max - 23ч 59 мин)
// TODO: Старт работы по кнопке И вывод            ПОДСКАЗКИ (ВЫНЕСТИ В Ф-ИЮ, ТК ПОВТОРЯЕТСЯ)
// TODO: Перенести бота на сервер
// TODO: убрать элементы 'ДЛЯ ОТЛАДКИ'
// ! Выключить VPN