// src/plugins/telegramMiniApp.js

/**
 * Плагин для интеграции Telegram Mini Apps (Web App API) во Vue 3
 * Документация: https://core.telegram.org/bots/webapps
 */

export default {
    install: (app) => {
        // Проверяем, находимся ли мы внутри Telegram Web App
        const isInTelegramWebApp = window.Telegram && window.Telegram.WebApp;

        // Создаем глобальный объект для работы с Telegram Web App
        const telegramApi = {
            // Состояние Telegram Web App
            isAvailable: isInTelegramWebApp,

            // Ссылка на экземпляр Telegram.WebApp, если он доступен
            webApp: isInTelegramWebApp ? window.Telegram.WebApp : null,

            // Информация о пользователе, если доступна
            user: isInTelegramWebApp ? window.Telegram.WebApp.initDataUnsafe?.user : null,

            // Методы для интеграции

            // Инициализация Web App
            init() {
                if (!this.isAvailable) return false;

                console.log('✅ Telegram WebApp:', this.webApp);
                console.log('📌 User Data:', this.webApp.initDataUnsafe);
                console.log('🌍 Platform:', this.webApp.platform);

                // Сообщаем Telegram, что приложение готово
                this.webApp.ready();

                // Устанавливаем основной цвет темы
                this.webApp.setHeaderColor(this.webApp.themeParams.bg_color || '#ffffff');

                return true;
            },

            // Закрыть Web App
            close() {
                if (this.isAvailable) {
                    this.webApp.close();
                }
            },

            // Открыть ссылку во внешнем браузере
            openLink(url) {
                if (this.isAvailable) {
                    this.webApp.openLink(url);
                } else {
                    window.open(url, '_blank');
                }
            },

            // Показать всплывающее уведомление
            showAlert(message, callback) {
                if (this.isAvailable) {
                    this.webApp.showAlert(message, callback);
                } else {
                    alert(message);
                    if (callback) callback();
                }
            },

            // Показать модальное окно с подтверждением
            showConfirm(message, callback) {
                if (this.isAvailable) {
                    this.webApp.showConfirm(message, callback);
                } else {
                    const result = confirm(message);
                    if (callback) callback(result);
                }
            },

            // Отправка данных обратно боту
            sendData(data) {
                if (this.isAvailable) {
                    // Данные должны быть строкой
                    this.webApp.sendData(typeof data === 'string' ? data : JSON.stringify(data));
                    return true;
                }
                return false;
            },

            // Включение/отключение кнопки "Назад" в заголовке
            enableBackButton(enabled) {
                if (this.isAvailable && this.webApp.BackButton) {
                    if (enabled) {
                        this.webApp.BackButton.show();
                    } else {
                        this.webApp.BackButton.hide();
                    }
                }
            },

            // Установка обработчика для кнопки "Назад"
            onBackButtonClicked(callback) {
                if (this.isAvailable && this.webApp.BackButton) {
                    this.webApp.BackButton.onClick(callback);
                }
            },

            // Включение/отключение кнопки "Главная" в заголовке
            enableMainButton(enabled, text = 'CONTINUE') {
                if (this.isAvailable && this.webApp.MainButton) {
                    if (enabled) {
                        this.webApp.MainButton.setText(text);
                        this.webApp.MainButton.show();
                    } else {
                        this.webApp.MainButton.hide();
                    }
                }
            },

            // Установка обработчика для кнопки "Главная"
            onMainButtonClicked(callback) {
                if (this.isAvailable && this.webApp.MainButton) {
                    this.webApp.MainButton.onClick(callback);
                }
            },

            // Поделиться контентом через Telegram
            shareContent(text, url) {
                console.log('📤 Share content request:', { text, url });

                // Проверка наличия текста
                if (!text) {
                    console.warn('❗ Text is required for sharing.');
                    return false;
                }

                // Формируем текст для публикации
                const shortUrl = url ? `➡️ [Детальніше](${url})` : '';
                const shareText = `${text}`;
            }
        };

        // Добавляем API в глобальный объект Vue
        app.config.globalProperties.$telegram = telegramApi;

        // Также добавляем его как реактивный объект для Composition API
        app.provide('telegram', telegramApi);

        // Инициализируем Web App, если мы в контексте Telegram
        if (telegramApi.isAvailable) {
            telegramApi.init();
        }
    }
};
