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
