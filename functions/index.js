const functions = require("firebase-functions"); // Move this line to the top
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const axios = require("axios");
const qs = require("qs");
const cors = require("cors")({
    origin: ["http://localhost:5173", "https://friendlychat-you-tube-short.web.app", "https://friendlychat-you-tube-short.firebaseapp.com"], // Разрешенные источники
    methods: ["GET", "POST"],
}); // Обработка CORS

admin.initializeApp();

const CLIENT_ID = '202115' || functions.config().olx?.client_id;
const CLIENT_SECRET = 'oR3rmPGlXWgtPTXlmwI1dt2wiKMtcZAUM3SaEnD3WvGpwvmY' || functions.config().olx?.client_secret;

/**
 * Функция для получения объявлений OLX.
 */
exports.getOlxAds = onRequest({ region: "us-central1" }, async (req, res) => {
    cors(req, res, async () => {
        try {
            console.log(`[INFO] [${new Date().toISOString()}] getOlxAds: Начало запроса.`);
            console.log(`[INFO] [${new Date().toISOString()}] getOlxAds: Запрос headers: ${JSON.stringify(req.headers)}`);

            // Получение токена из заголовка Authorization
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                console.error(`[ERROR] [${new Date().toISOString()}] getOlxAds: Токен не предоставлен.`);
                return res.status(401).json({ error: "Токен не предоставлен." });
            }

            // Запрос к API OLX
            const response = await axios.get("https://www.olx.ua/api/partner/cities", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log(
                `[INFO] [${new Date().toISOString()}] getOlxAds: Объявления OLX успешно получены. Статус: ${response.status
                }, данные: ${JSON.stringify(response.data)}`
            );
            return res.status(200).json(response.data);
        } catch (error) {
            console.error(`[ERROR] [${new Date().toISOString()}] getOlxAds: Ошибка получения объявлений OLX: ${error}`);
            console.error(
                `[ERROR] [${new Date().toISOString()}] getOlxAds: Ошибка details: ${JSON.stringify(error.response?.data)}`
            );

            // Обработка ошибок авторизации от OLX
            if (error.response && error.response.status === 401) {
                return res.status(401).json({ error: "Недействительный токен." });
            }

            return res.status(500).json({ error: "Ошибка сервера при получении объявлений." });
        }
    });
});

/**
 * Функция для получения токена OLX.
 */
let cachedToken = null;
let tokenExpiration = null;

// Функция для получения токена с кэшированием
async function getOlxToken() {
    console.log(`[INFO] [${new Date().toISOString()}] getOlxToken: Проверка кэшированного токена.`);
    if (cachedToken && tokenExpiration > Date.now()) {
        console.log(`[INFO] [${new Date().toISOString()}] getOlxToken: Использование кэшированного токена.`);
        return cachedToken;
    }

    try {
        console.log(`[INFO] [${new Date().toISOString()}] getOlxToken: Запрос нового токена.`);

        const data = qs.stringify({
            grant_type: "client_credentials",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        });

        const response = await axios.post(
            "https://www.olx.ua/api/open/oauth/token",
            data,
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
        );

        cachedToken = response.data.access_token;
        tokenExpiration = Date.now() + response.data.expires_in * 1000;

        console.log(`[INFO] [${new Date().toISOString()}] getOlxToken: Новый токен получен.`);
        return cachedToken;
    } catch (error) {
        console.error(`[ERROR] [${new Date().toISOString()}] getOlxToken: Ошибка получения токена: ${error}`);
        throw new Error("Ошибка сервера при получении токена.");
    }
}

exports.getOlxToken = onRequest({ region: "us-central1" }, async (req, res) => {
    console.log(`[INFO] [${new Date().toISOString()}] getOlxToken: Начало запроса.`);
    cors(req, res, async () => {
        try {
            const token = await getOlxToken();
            console.log(`[INFO] [${new Date().toISOString()}] getOlxToken: Токен успешно получен.`);
            return res.status(200).json({ access_token: token });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });
});
