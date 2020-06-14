process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const myKeyboard = require('./project_modules/keyboard'); // модуль с клавиатурой 
const messages = require('./project_modules/messages'); // модуль с уведомлениями 
const config = require('./project_modules/config'); // модуль с конфигурацией проекта 
const botFunctions = require('./project_modules/bot_functions'); // модуль с функциями и методами бота 

const token = config.TOKEN; // TOKEN бота
const bot = new TelegramBot(token, {
  polling: true
});
messages.setBot(bot); // добавляем bot в модуль messages, чтобы оттуда отправлять сообщения
let isCommand = false;
let note = {}; // объект, содержащий данные, которые передадутся в ф-ию ожидания отправки уведомления 

bot.on('message', msg => {
  let userId = msg.from.id; // id отправителя сообщения 
  messages.setUserID(userId); // добавляем userId в модуль messages, чтобы оттуда отправлять сообщения

  switch (msg.text) {
    case '/start':
      isCommand = true;
      // появление клавиатуры
      bot.sendMessage(userId, ('Hello, ' + msg.from.first_name + '!\n' + messages.botAnswers('firstStart')), {
        reply_markup: {
          keyboard: myKeyboard.startKb
        }
      });
      break;
    case 'START':
      isCommand = true;
      // сброс таймера
      botFunctions.clrTimeout();
      // появление клавиатуры
      bot.sendMessage(userId, messages.botAnswers('butStart'), {
        reply_markup: {
          keyboard: myKeyboard.intervalsKb
        }
      });
      break;
    case 'WRONG TIME':
      isCommand = true;
      // сброс таймера
      botFunctions.clrTimeout();
      // появление клавиатуры
      bot.sendMessage(userId, 'Send me the correct time (for example 15:30):', {
        reply_markup: {
          keyboard: myKeyboard.stopOnlyKb
        }
      });
      break;
    case 'STOP':
      isCommand = true;
      // сброс таймера
      botFunctions.clrTimeout();
      // появление клавиатуры
      bot.sendMessage(userId, messages.botAnswers('butStop'), {
        reply_markup: {
          keyboard: myKeyboard.startKb
        }
      });
      break;
    case 'PAUSE':
      isCommand = true;
      // сброс таймера
      botFunctions.clrTimeout();
      // появление кнопки RESUME
      bot.sendMessage(userId, messages.botAnswers('butPause'), {
        reply_markup: {
          keyboard: myKeyboard.pauseKb
        }
      });
      break;
    case 'RESUME':
      isCommand = true;
      // появление кнопки PAUSE
      bot.sendMessage(userId, 'I\'m working again', {
        reply_markup: {
          keyboard: myKeyboard.stopKb
        }
      }).then(() => {
        botFunctions.countdown(bot, note, true);
      })
      break;
    case '/help':
      messages.botSendMyMessage('butHelp');
      isCommand = true;
      break;
    default:
      break;
  }
})

// интервал работы - отдыха или новое время
bot.onText(/(\d{1,4})( |:)(\d{1,4})/, (msg, match) => {
  isCommand = true;

  let promise = new Promise((resolve, reject) => {
    // если указан интервал
    if (/([1-9]\d{0,3})( )([1-9]\d{0,3})/.test(match[0])) {
      note = botFunctions.notePreparing(msg, match);
      resolve();
    }
    // если указано новое время
    else {
      let res = match[0].split(':');
      note.startHours = res[0];
      note.startMinutes = res[1];
      resolve();
    }
  });

  promise.then(() => {
    // отсчет времени до уведомления
    botFunctions.countdown(bot, note);
  });

  promise.catch(error => {
    console.log(error);
  });
})

// !
// ! не было комманды
// ! if (isCommand == false)
// !   messages.botSendMyMessage('butHelp');