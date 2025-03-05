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

exports.getOlxRegions = onRequest({ region: "us-central1" }, async (req, res) => {
    console.log(`[INFO] [${new Date().toISOString()}] getOlxRegions: Начало запроса...`);
    cors(req, res, async () => {
        console.log(`[INFO] [${new Date().toISOString()}] getOlxRegions: CORS middleware выполнено.`);
        try {
            console.log(`[INFO] [${new Date().toISOString()}] getOlxRegions: Начало запроса.`);
            console.log(`[INFO] [${new Date().toISOString()}] getOlxRegions: Запрос headers: ${JSON.stringify(req.headers)}`);

            verifyToken(req, res, async () => {
                console.log(`[INFO] [${new Date().toISOString()}] getOlxRegions: Проверка токена прошла успешно.`);
                const data = await fetchOlxData('https://www.olx.ua/api/partner/regions', req.token)
                console.log(
                    `[INFO] [${new Date().toISOString()}] getOlxRegions: Объявления OLX успешно получены. Статус: 200, данные: ${JSON.stringify(data)}`
                );
                return res.status(200).json(data);
            })
        } catch (error) {
            return res.status(error.message === 'Invalid token' ? 401 : 500).json({ error: error.message });
        }
    });
});

exports.getOlxCities = onRequest({ region: "us-central1" }, async (req, res) => {
    console.log(`[INFO] [${new Date().toISOString()}] getOlxCities: Начало запроса...`);
    cors(req, res, async () => {
        console.log(`[INFO] [${new Date().toISOString()}] getOlxCities: CORS middleware выполнено.`);
        try {
            console.log(`[INFO] [${new Date().toISOString()}] getOlxCities: Начало запроса.`);

            verifyToken(req, res, async () => {
                const data = await fetchOlxData("https://www.olx.ua/api/partner/cities", req.token)
                console.log(
                    `[INFO] [${new Date().toISOString()}] getOlxCities: Города OLX успешно получены. Статус: 200, данные: ${JSON.stringify(data)}`
                );
                return res.status(200).json(data);
            })
        } catch (error) {
            return res.status(error.message === 'Invalid token' ? 401 : 500).json({ error: error.message });
        }
    });
});

exports.getOlxCityDetails = onRequest({ region: "us-central1" }, async (req, res) => {
    console.log(`[INFO] [${new Date().toISOString()}] getOlxCityDetails: Начало запроса...`);
    cors(req, res, async () => {
        console.log(`[INFO] [${new Date().toISOString()}] getOlxCityDetails: CORS middleware выполнено.`);
        try {
            console.log(`[INFO] [${new Date().toISOString()}] getOlxCityDetails: Начало запроса.`);
            console.log(`[INFO] [${new Date().toISOString()}] getOlxCityDetails: Запрос headers: ${JSON.stringify(req.headers)}`);

            verifyToken(req, res, async () => {
                const cityId = req.params[0]; // Предполагается, что cityId передается в URL
                if (!cityId) {
                    console.error(`[ERROR] [${new Date().toISOString()}] getOlxCityDetails: cityId не предоставлен.`);
                    return res.status(400).json({ error: "cityId не предоставлен." });
                }
                const data = await fetchOlxData(`https://www.olx.ua/api/partner/cities/${cityId}`, req.token)
                console.log(
                    `[INFO] [${new Date().toISOString()}] getOlxCityDetails: Информация о городе OLX успешно получена. Статус: 200, данные: ${JSON.stringify(data)}`
                );
                return res.status(200).json(data);
            })
        } catch (error) {
            return res.status(error.message === 'Invalid token' ? 401 : 500).json({ error: error.message });
        }
    });
});
