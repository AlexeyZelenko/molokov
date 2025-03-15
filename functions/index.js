const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { cors } = require("./utils");
const { getTokenOlx, fetchOlxData } = require("./olxService");
const { verifyToken } = require('./middleware')

admin.initializeApp();

exports.getOlxToken = onRequest({ region: "us-central1" }, async (req, res) => {
    console.log(`[INFO] [${new Date().toISOString()}] getOlxToken: Начало запроса.`);
    cors(req, res, async () => {
        console.log(`[INFO] [${new Date().toISOString()}] getOlxToken: CORS middleware выполнено.`);
        try {
            const token = await getTokenOlx();
            console.log(`[INFO] [${new Date().toISOString()}] getOlxToken: Токен успешно получен.`);
            return res.status(200).json({ access_token: token });
        } catch (error) {
            console.error(`[ERROR] [${new Date().toISOString()}] getOlxToken: Ошибка получения токена:`, error); // Log the entire error object
            if (error.response) {
                console.error(`[ERROR] [${new Date().toISOString()}] getOlxToken: Ошибка details: ${JSON.stringify(error.response.data)}`);
                if (error.response.status === 401) {
                    return res.status(401).json({ error: "Недействительный токен." });
                } else if (error.response.status === 403) {
                    return res.status(403).json({ error: "Доступ запрещен." }); // More specific error message
                }
            }
            return res.status(500).json({ error: "Ошибка сервера при получении токена." });
        }
    });
});

exports.getOlxRegions = onRequest({ region: "us-central1" }, (req, res) => {
    console.log(`[INFO] [${new Date().toISOString()}] getOlxRegions: Запрос начат.`);

    cors(req, res, async () => {
        console.log(`[INFO] [${new Date().toISOString()}] getOlxRegions: CORS выполнен.`);
        console.log(`[INFO] [${new Date().toISOString()}] getOlxRegions: Запрос headers: ${JSON.stringify(req.headers)}`);

        try {
            await verifyToken(req, res);
            console.log(`[INFO] [${new Date().toISOString()}] getOlxRegions: Токен подтвержден.`);

            const data = await fetchOlxData('https://www.olx.ua/api/partner/regions', req.token);
            console.log(`[INFO] [${new Date().toISOString()}] getOlxRegions: Данные получены (${data.length} записей).`);

            return res.status(200).json(data);
        } catch (error) {
            console.error(`[ERROR] [${new Date().toISOString()}] getOlxRegions: Ошибка: ${error.message}`);
            if (!res.headersSent) {
                return res.status(error.message === 'Invalid token' ? 401 : 500).json({ error: error.message });
            }
        }
    });
});

exports.getOlxCities = onRequest({ region: "us-central1" }, async (req, res) => {
    console.log(`[INFO] [${new Date().toISOString()}] getOlxCities: Запрос начат.`);

    cors(req, res, async () => {
        try {
            console.log(`[INFO] [${new Date().toISOString()}] getOlxCities: CORS выполнен.`);

            await verifyToken(req, res);
            console.log(`[INFO] [${new Date().toISOString()}] getOlxCities: Токен подтвержден.`);

            const limit = req.query.limit || 2000;
            const offset = req.query.offset || 5000;
            console.log(`[INFO] [${new Date().toISOString()}] getOlxCities: limit=${limit}, offset=${offset}`);
            const url = `https://www.olx.ua/api/partner/cities?offset=${offset}&limit=${limit}`;
            console.log(`[INFO] [${new Date().toISOString()}] getOlxCities: Запрос URL=${url}`);

            const cities = await fetchOlxData(url, req.token);

            if (!cities || cities.length === 0) {
                console.log(`[INFO] [${new Date().toISOString()}] getOlxCities: Нет данных.`);
                return res.status(200).json([]);
            }

            console.log(`[INFO] [${new Date().toISOString()}] getOlxCities: Получено ${cities.length} записей.`);
            return res.status(200).json(cities);

        } catch (error) {
            console.error(`[ERROR] [${new Date().toISOString()}] getOlxCities: Ошибка: ${error.message}`);
            return res.status(error.message === 'Invalid token' ? 401 : 500).json({ error: error.message });
        }
    });
});

exports.getOlxCityDetails = onRequest({ region: "us-central1" }, async (req, res) => {
    console.log(`[INFO] [${new Date().toISOString()}] getOlxCityDetails: Начало запроса...`);

    cors(req, res, async () => {
        try {
            console.log(`[INFO] [${new Date().toISOString()}] getOlxCityDetails: CORS middleware выполнено.`);
            console.log(`[INFO] [${new Date().toISOString()}] getOlxCityDetails: Запрос headers: ${JSON.stringify(req.headers)}`);

            await verifyToken(req, res);
            console.log(`[INFO] [${new Date().toISOString()}] getOlxCityDetails: Токен подтвержден.`);

            const cityId = req.query.cityId || req.params.cityId;
            if (!cityId) {
                console.error(`[ERROR] [${new Date().toISOString()}] getOlxCityDetails: cityId не предоставлен.`);
                return res.status(400).json({ error: "cityId не предоставлен." });
            }

            console.log(`[INFO] [${new Date().toISOString()}] getOlxCityDetails: Запрос к OLX API: /cities/${cityId}`);
            const data = await fetchOlxData(`https://www.olx.ua/api/partner/cities/${cityId}`, req.token);

            console.log(`[INFO] [${new Date().toISOString()}] getOlxCityDetails: Данные успешно получены.`);
            return res.status(200).json(data);

        } catch (error) {
            console.error(`[ERROR] [${new Date().toISOString()}] getOlxCityDetails: Ошибка: ${error.message}`);
            if (!res.headersSent) {
                return res.status(error.message === 'Invalid token' ? 401 : 500).json({ error: error.message });
            }
        }
    });
});

async function getPropertyData(propertyId) {
    try {
        console.log('getPropertyData: Начало выполнения функции');
        console.log('getPropertyData: propertyId:', propertyId);

        // Получаем ссылку на коллекцию
        const collectionRef = admin
            .firestore()
            .collection('properties/apartments/rent');
        console.log('getPropertyData: Получена ссылка на коллекцию:', collectionRef.path);

        // Преобразуем propertyId в число
        const numericPropertyId = Number(propertyId);
        console.log('getPropertyData: Преобразованный propertyId в число:', numericPropertyId);

        // Создаем запрос с фильтром по propertyId
        const query = collectionRef.where('idProperty', '==', numericPropertyId).limit(1);
        console.log('getPropertyData: Создан запрос:', query.toString());

        const querySnapshot = await query.get();
        console.log('getPropertyData: Результат запроса:', querySnapshot);

        if (querySnapshot.empty) {
            console.log('getPropertyData: Документ не найден');
            throw new Error('Property not found');
        }

        // Получаем первый документ из результата запроса
        const doc = querySnapshot.docs[0];
        console.log('getPropertyData: Получен документ:', doc.id);

        const data = doc.data();
        console.log('getPropertyData: Данные документа:', data);

        const result = { id: doc.id, ...data };
        console.log('getPropertyData: Результат функции:', result);

        console.log('getPropertyData: Завершение выполнения функции');
        return result;
    } catch (error) {
        console.error('getPropertyData: Ошибка:', error);
        return null;
    }
}

exports.ogShare = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        try {
            const propertyId = req.query.id;

            if (!propertyId) {
                return res.status(400).send('Property ID is required');
            }

            const propertyData = await getPropertyData(propertyId);

            if (!propertyData) {
                return res.status(404).send('Property not found');
            }

            console.log('propertyData', propertyData);
            const redirectUrl = `https://friendlychat-you-tube-short.web.app/pages/${propertyData.category.code}/view/${propertyData.subcategory.code}/${propertyData.id}?category=${propertyData.category.code}&subcategory=${propertyData.subcategory.code}&id=${propertyData.id}`;

            let imageUrl = '';
            if (propertyData.images && propertyData.images.length > 0) {
                imageUrl = propertyData.images[0];
            }

            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${propertyData.title || 'Нерухомість'}</title>
                    <meta name="description" content="${propertyData.description || 'Опис нерухомості'}">
                    <meta property="og:title" content="${propertyData.title || 'Нерухомість'}">
                    <meta property="og:description" content="${propertyData.description || 'Опис нерухомості'}">
                    <meta property="og:image" content="${imageUrl}">
                    <meta property="og:url" content="${redirectUrl}">
                    <meta property="og:type" content="website">
                    <meta property="og:site_name" content="Нерухомість">
                    <meta http-equiv="refresh" content="0;url=${redirectUrl}">
                    <script>window.location.href = "${redirectUrl}";</script>
                </head>
                <body>
                    <p>Перенаправлення на <a href="${redirectUrl}">${propertyData.title || 'Нерухомість'}</a>...</p>
                </body>
                </html>
            `;

            res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
            res.send(html);
        } catch (error) {
            console.error('Error processing request:', error);
            res.status(500).send('Internal Server Error');
        }
    });
});
