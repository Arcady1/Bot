# [Telegram Pomodoro Bot][1]

## Описание (this guide will soon be translated in English)
Данный бот позволяет работать эффективнее, напоминая, когда пришло время поработать, а когда - отдохнуть.  
Представим, что сейчас 9:00. Вы отправляете боту два числа, например: 50 10, где 50 - время, выделенное на работу (в минутах), 10 - на отдых. 
Тогда бот напишет в 9:50 и 10:00; 10:50 и 11:00 и т.д.

## Деплой Telegram бота на [Glitch][2]
1. Регистрируемся на сайте (есть возможность авторизоваться с помощью GitHub).
2. Создаем новый проект *NewProject*.
3. Нажимаем *Import from GitHub* и указываем путь к репозиторию.
4. После чего следует удалить из проекта пути к модулям, которые не были залиты на GitHub (если таковые имеются). Также рекомендую перенести в *.env* TOKEN вашего бота, чтобы никто не мог его увидеть, а в самом коде прописать `const token = process.env.TOKEN;`, где token - переменная, котрую вы используете, а TOKEN - имя переменной из *.env*.  
  
Если после проделанной работы справа от вкладки *Tools* (левый нижний угол) написанно *Error*, читайте далее, в противном случае - поздравляю, сервер заработал!
***

В левом нижнем углу нажимаем *Tools*, *Terminal* и пишем следующие команды:  
`apt-get update`  
`apt-get install git -su`.  
В качестве проверки вводим команду `git`. Ошибок быть не должно  
`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`.  
Следующая команда довольно длинная, ввести ее нужно целиком:  
`export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`.  
Чтобы проверить, установился ли nvm вводим команду `nvm`.   
Если появились ошибки или ничего не отобразилось, посмотрите команды [в этом репозитории][4].  
`nvm install <version>`. Вместо *version* указываем ту версию, которая использовалась при разработке проекта.  
Чтобы ее узнать, необходимо ввести в терминале своего ПК `node -v`.  
`nvm use <version>`. Вместо *version* указать ту же версию, что и на предыдущем шаге.  
`node -v`. Должна появиться используемая версия.  
Осталось установить пакеты, используемые в проекте:
`npm i`.  
Запускаем бота:  
`npm run start`.  
Если через несколько секунд появляется ошибка ` {"code":"ETELEGRAM","message":"ETELEGRAM: 409 Conflict: terminated by other getUpdates request; make sure that only one bot instance is running"}`, значит, ваш бот уже работает. Просто нажмите Ctrl + C.  
После чего заходим в профиль, находим *Recent Projects* и кликаем на проект.  
Появится окошко с надписью *Started*. Пока оно активно, бот работает. В противном случае он отключится через 5 мин. Подробнее можно прочитать [здесь][3].  

## Может быть полезно
* [nvm-sh/nvm][4]  
* [Telegram bot on JavaScript with free hosting][5]  



[1]: https://t.me/pomodoro_25and5_bot                                                     "bot"
[2]: https://glitch.com/                                                                  "Glitch"
[3]: https://glitch.com/help/restrictions/                                                "timing-Glitch"
[4]: https://github.com/nvm-sh/nvm                                                        "nvm"
[5]: https://medium.com/roomjs/telegram-bot-on-javascript-with-free-hosting-53ae01bce991  "medium"
