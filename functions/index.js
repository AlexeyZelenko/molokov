const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { cors } = require('./utils');
const nodemailer = require('nodemailer');

admin.initializeApp();

let transporter = null;

async function getPropertyData(propertyId) {
    try {
        const collectionRef = admin.firestore().collection('properties/apartments/rent');
        const numericPropertyId = Number(propertyId);

        if (isNaN(numericPropertyId)) {
            console.error('getPropertyData: Невалидный propertyId:', propertyId);
            throw new Error('Invalid property ID');
        }

        const query = collectionRef.where('idProperty', '==', numericPropertyId).limit(1);
        const querySnapshot = await query.get();

        if (querySnapshot.empty) {
            throw new Error('Property not found');
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data();

        const result = { id: doc.id, ...data };

        return result;
    } catch (error) {
        console.error('getPropertyData: Ошибка:', error);
        return null;
    }
}

exports.ogShare = functions.https.onRequest(async (req, res) => {
    if (req.method === 'OPTIONS') {
        cors(req, res, () => {
            res.status(204).send();
        });
        return;
    }

    cors(req, res, async () => {
        try {
            const propertyId = req.query.id;

            if (!propertyId) {
                console.error('ogShare: Property ID не предоставлен');
                return res.status(400).send('Property ID is required');
            }

            const propertyData = await getPropertyData(propertyId);

            if (!propertyData) {
                console.error('ogShare: Данные по property ID не найдены или ошибка при получении');
                return res.status(404).send('Property not found');
            }

            if (!propertyData.category || !propertyData.category.code ||
                !propertyData.subcategory || !propertyData.subcategory.code ||
                !propertyData.id) {
                console.error('ogShare: В данных propertyData отсутствуют необходимые поля для URL:', propertyData);
                return res.status(500).send('Недостаточно данных для формирования ссылки');
            }

            const redirectUrl = `https://friendlychat-you-tube-short.web.app/pages/${propertyData.category.code}/view/${propertyData.subcategory.code}/${propertyData.id}?category=${propertyData.category.code}&subcategory=${propertyData.subcategory.code}&id=${propertyData.id}`;

            let imageUrl = '';
            if (Array.isArray(propertyData.images) && propertyData.images.length > 0) {
                if (typeof propertyData.images[0] === 'string') {
                    imageUrl = propertyData.images[0];
                } else {
                    console.warn('ogShare: propertyData.images[0] не является строкой:', propertyData.images[0]);
                }
            } else if (propertyData.images !== undefined && propertyData.images !== null) {
                console.warn('ogShare: propertyData.images не является массивом или пуст:', propertyData.images);
            }

            const title = typeof propertyData.title === 'string' ? propertyData.title : 'Нерухомість';
            const description = typeof propertyData.description === 'string' ? propertyData.description : 'Опис нерухомості';

            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${title}</title>
                    <meta name="description" content="${description}">
                    <meta property="og:title" content="${title}">
                    <meta property="og:description" content="${description}">
                    <meta property="og:image" content="${imageUrl}">
                    <meta property="og:url" content="${redirectUrl}">
                    <meta property="og:type" content="website">
                    <meta property="og:site_name" content="Нерухомість">
                    <script>window.location.replace("${redirectUrl}");</script>
                </head>
                <body>
                    <p>Перенаправлення на <a href="${redirectUrl}">${title}</a>...</p>
                </body>
                </html>
            `;

            res.set('Content-Type', 'text/html');
            res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
            res.send(html);
        } catch (error) {
            console.error('ogShare: Error processing request:', error);
            if (error.message === 'Invalid property ID') {
                res.status(400).send(error.message);
            } else if (error.message === 'Property not found') {
                res.status(404).send(error.message);
            } else {
                res.status(500).send('Internal Server Error');
            }
        }
    });
});

const saveMessageToFirestore = async (clientData) => {
    if (!clientData || typeof clientData !== 'object' || !clientData.name || !clientData.email || !clientData.subject || !clientData.message) {
        const missingFields = [];
        if (!clientData) missingFields.push('clientData object is null/undefined');
        if (typeof clientData !== 'object') missingFields.push('clientData is not an object');
        if (clientData && !clientData.name) missingFields.push('name');
        if (clientData && !clientData.email) missingFields.push('email');
        if (clientData && !clientData.subject) missingFields.push('subject');
        if (clientData && !clientData.message) missingFields.push('message');

        const error = new Error(`Invalid data for Firestore save. Missing fields: ${missingFields.join(', ')}`);
        console.error('saveMessageToFirestore:', error.message, clientData);
        throw error;
    }

    const supportCollection = admin.firestore().collection('supportMessages');
    await supportCollection.add({
        name: clientData.name,
        email: clientData.email,
        subject: clientData.subject,
        message: clientData.message,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
};

exports.sendSupportMessage = functions.https.onCall(async (data, context) => {
    console.log(`[INFO] sendSupportMessage: Получен вызов.`);
    console.log(`[INFO] sendSupportMessage: Тип аргумента data (обгортка):`, typeof data);
    console.log(`[INFO] sendSupportMessage: Тип аргумента context:`, typeof context);
    console.log(`[INFO] sendSupportMessage: Содержимое аргумента context:`, context);

    try {
        const clientData = data?.data;
        const authData = data?.auth;

        console.log(`[INFO] sendSupportMessage: Тип clientData (реальные данные):`, typeof clientData);
        console.log(`[INFO] sendSupportMessage: Содержимое clientData (реальные данные):`, clientData);
        console.log(`[INFO] sendSupportMessage: Тип authData:`, typeof authData);
        console.log(`[INFO] sendSupportMessage: Содержимое authData:`, authData);

        if (!clientData || typeof clientData !== 'object' || !clientData.name || !clientData.email || !clientData.subject || !clientData.message) {
            console.error(`[ERROR] sendSupportMessage: Отсутствуют или неверный формат обязательных полей в клиентских данных.`, clientData);
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Будь ласка, заповніть всі обов\'язкові поля та переконайтесь у правильності формату.'
            );
        }

        let subjectText = 'Запит у підтримку';
        switch (clientData.subject) {
            case 'technical':
                subjectText = 'Технічна проблема';
                break;
            case 'billing':
                subjectText = 'Питання щодо рахунку';
                break;
            case 'suggestion':
                subjectText = 'Пропозиція';
                break;
            case 'other':
                subjectText = 'Інше питання';
                break;
            default:
                console.warn(`sendSupportMessage: Получена неизвестная тема в clientData.subject: ${clientData.subject}. Использование темы по умолчанию.`);
                break;
        }

        if (!transporter) {
            console.log('[INFO] sendSupportMessage: Инициализация transporter.');
            try {
                console.log('[INFO] sendSupportMessage: Инициализация transporter для подтверждения.', process.env);
                transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.GMAIL_USER || 'zelenkooleksii75@gmail.com',
                        pass: process.env.GMAIL_PASS || 'ursb cviw zmqe cymn'
                    }
                });
                console.log('[INFO] sendSupportMessage: Transporter успешно инициализирован.');
            } catch (initError) {
                console.error('[ERROR] sendSupportMessage: Ошибка инициализации transporter:', initError);
                throw new functions.https.HttpsError('internal', 'Не удалось настроить отправку email.', initError.message);
            }
        }

        const mailOptions = {
            from: '"Система підтримки" <zelenkooleksii75@gmail.com>',
            to: 'zelenkooleksii75@gmail.com',
            replyTo: clientData.email,
            subject: `[Підтримка] ${subjectText} від ${clientData.name}`,
            html: `
                <h2>Нове повідомлення у підтримку</h2>
                <p><strong>Від:</strong> ${clientData.name} (${clientData.email})</p>
                <p><strong>Тема:</strong> ${subjectText}</p>
                <p><strong>Повідомлення:</strong></p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                  ${clientData.message}
                </div>
              `,
        };

        console.log(`[INFO] sendSupportMessage: Отправка email в поддержку.`);
        await transporter.sendMail(mailOptions);
        console.log(`[INFO] sendSupportMessage: Email в поддержку успешно отправлен.`);

        console.log(`[INFO] sendSupportMessage: Сохранение сообщения в Firestore.`);
        await saveMessageToFirestore(clientData);
        console.log(`[INFO] sendSupportMessage: Сообщение успешно сохранено в Firestore.`);

        if (!transporter) {
            console.log('[INFO] sendSupportMessage: Повторная попытка инициализации transporter для подтверждения.');
            try {
                console.log('[INFO] sendSupportMessage: Инициализация transporter для подтверждения.', process.env);
                transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.GMAIL_USER || 'zelenkooleksii75@gmail.com',
                        pass: process.env.GMAIL_PASS || 'ursb cviw zmqe cymn'
                    }
                });
                console.log('[INFO] sendSupportMessage: Transporter успешно инициализирован для подтверждения.');
            } catch (initError) {
                console.error('[ERROR] sendSupportMessage: Ошибка повторной инициализации transporter для подтверждения:', initError);
            }
        }

        if (transporter && clientData.email) {
            const userConfirmation = {
                from: '"Служба підтримки" <zelenkooleksii75@gmail.com>',
                to: clientData.email,
                subject: 'Ваше звернення отримано',
                html: `
                    <h2>Дякуємо за ваше звернення!</h2>
                    <p>Шановний(а) ${clientData.name},</p>
                    <p>Ми отримали ваше повідомлення і працюємо над ним. Наша команда підтримки зв'яжеться з вами якнайшвидше.</p>
                    <p><strong>Тема вашого звернення:</strong> ${subjectText}</p>
                    <p>З повагою,<br>Команда підтримки</p>
                `,
            };

            console.log(`[INFO] sendSupportMessage: Отправка подтверждения пользователю.`);
            try {
                await transporter.sendMail(userConfirmation);
                console.log(`[INFO] sendSupportMessage: Подтверждение отправлено.`);
            } catch (sendError) {
                console.error(`[ERROR] sendSupportMessage: Ошибка отправки подтверждения пользователю:`, sendError);
            }
        } else if (!clientData.email) {
            console.warn('sendSupportMessage: Отсутствует email пользователя для отправки подтверждения.');
        }

        return { success: true };
    } catch (error) {
        console.error(`[ERROR] sendSupportMessage: Ошибка обработки запроса:`, error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'Сталася внутрішня помилка сервера.', error.message);
    }
});

exports.sendSupportMessageHttp = functions.https.onRequest(async (req, res) => {
    if (req.method === 'OPTIONS') {
        cors(req, res, () => {
            res.status(204).send();
        });
        return;
    }

    cors(req, res, async () => {
        try {
            if (req.method !== 'POST') {
                console.error(`[ERROR] sendSupportMessageHttp: Неверный метод запроса: ${req.method}`);
                return res.status(405).json({ error: 'Метод не разрешен. Используйте POST.' });
            }

            const data = req.body;

            console.log(`[INFO] sendSupportMessageHttp: Отримані дані:`, data);

            if (!data || typeof data !== 'object' || !data.name || !data.email || !data.subject || !data.message) {
                console.error(`[ERROR] sendSupportMessageHttp: Отсутствуют или неверный формат обязательных полей.`, data);
                return res.status(400).json({ error: "Будь ласка, заповніть всі обов'язкові поля та переконайтесь у правильності формату." });
            }

            let subjectText = 'Запит у підтримку';
            switch (data.subject) {
                case 'technical':
                    subjectText = 'Технічна проблема';
                    break;
                case 'billing':
                    subjectText = 'Питання щодо рахунку';
                    break;
                case 'suggestion':
                    subjectText = 'Пропозиція';
                    break;
                case 'other':
                    subjectText = 'Інше питання';
                    break;
                default:
                    console.warn(`sendSupportMessageHttp: Получена неизвестная тема: ${data.subject}. Использование темы по умолчанию.`);
                    break;
            }

            if (!transporter) {
                console.log('[INFO] sendSupportMessageHttp: Инициализация transporter.');
                try {
                    transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.GMAIL_USER,
                            pass: process.env.GMAIL_PASS
                        }
                    });
                    console.log('[INFO] sendSupportMessageHttp: Transporter успешно инициализирован.');
                } catch (initError) {
                    console.error('[ERROR] sendSupportMessageHttp: Ошибка инициализации transporter:', initError);
                    return res.status(500).json({
                        error: 'Не удалось настроить отправку email.',
                        details: initError.message
                    });
                }
            }

            const mailOptions = {
                from: '"Система підтримки" <zelenkooleksii75@gmail.com>',
                to: 'zelenkooleksii75@gmail.com',
                replyTo: data.email,
                subject: `[Підтримка] ${subjectText} від ${data.name}`,
                html: `
                    <h2>Нове повідомлення у підтримку</h2>
                    <p><strong>Від:</strong> ${data.name} (${data.email})</p>
                    <p><strong>Тема:</strong> ${subjectText}</p>
                    <p><strong>Повідомлення:</strong></p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                      ${data.message}
                    </div>
                  `,
            };

            console.log(`[INFO] sendSupportMessageHttp: Отправка email в поддержку.`);
            try {
                await transporter.sendMail(mailOptions);
                console.log(`[INFO] sendSupportMessageHttp: Email в поддержку успешно отправлен.`);
            } catch (sendError) {
                console.error(`[ERROR] sendSupportMessageHttp: Ошибка отправки email в поддержку:`, sendError);
                return res.status(500).json({
                    error: 'Ошибка при отправке email в поддержку.',
                    details: sendError.message
                });
            }

            console.log(`[INFO] sendSupportMessageHttp: Сохранение сообщения в Firestore.`);
            try {
                await saveMessageToFirestore(data);
                console.log(`[INFO] sendSupportMessageHttp: Сообщение успешно сохранено в Firestore.`);
            } catch (saveError) {
                console.error(`[ERROR] sendSupportMessageHttp: Ошибка сохранения в Firestore:`, saveError);
                return res.status(500).json({
                    error: 'Ошибка при сохранении сообщения.',
                    details: saveError.message
                });
            }

            if (transporter && data.email) {
                const userConfirmation = {
                    from: '"Служба підтримки" <zelenkooleksii75@gmail.com>',
                    to: data.email,
                    subject: 'Ваше звернення отримано',
                    html: `
                        <h2>Дякуємо за ваше звернення!</h2>
                        <p>Шановний(а) ${data.name},</p>
                        <p>Ми отримали ваше повідомлення і працюємо над ним. Наша команда підтримки зв'яжеться з вами якнайшвидше.</p>
                        <p><strong>Тема вашого звернення:</strong> ${subjectText}</p>
                        <p>З повагою,<br>Команда підтримки</p>
                    `,
                };

                console.log(`[INFO] sendSupportMessageHttp: Отправка подтверждения пользователю.`);
                try {
                    await transporter.sendMail(userConfirmation);
                    console.log(`[INFO] sendSupportMessageHttp: Подтверждение отправлено.`);
                } catch (sendError) {
                    console.error(`[ERROR] sendSupportMessageHttp: Ошибка отправки подтверждения пользователю:`, sendError);
                }
            } else if (!data.email) {
                console.warn('sendSupportMessageHttp: Отсутствует email пользователя для отправки подтверждения.');
            }

            return res.status(200).json({ success: true });

        } catch (error) {
            console.error(`[ERROR] sendSupportMessageHttp: Ошибка:`, error);
            return res.status(500).json({
                error: 'Сталася внутрішня помилка сервера.',
                details: error.message
            });
        }
    });
});
