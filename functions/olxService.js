// functions/olxService.js
const axios = require("axios");
const qs = require("qs");
const { CLIENT_ID, CLIENT_SECRET } = require("./config");

let cachedToken = null;
let tokenExpiration = null;

async function getTokenOlx() {
    console.log(`[INFO] [${new Date().toISOString()}] getOlxToken: Проверка кэшированного токена.`);
    if (cachedToken && tokenExpiration > Date.now()) {
        console.log(`[INFO] [${new Date().toISOString()}] getOlxToken: Использование кэшированного токена.`);
        return cachedToken;
    }

    try {
        console.log(`[INFO] [${new Date().toISOString()}] getOlxToken: Запрос нового токена...`);
        console.log(`[INFO] [${new Date().toISOString()}] getOlxToken: CLIENT_ID: ${CLIENT_ID}, CLIENT_SECRET: ${CLIENT_SECRET}`);

        const data = qs.stringify({
            grant_type: "client_credentials",
            client_id: '202115' || CLIENT_ID,
            client_secret: 'oR3rmPGlXWgtPTXlmwI1dt2wiKMtcZAUM3SaEnD3WvGpwvmY' || CLIENT_SECRET,
            scope: "v2 read write"
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

async function fetchOlxData(url, token) {
    try {
        console.log(`[INFO] [${new Date().toISOString()}] getOlxData: Запрос данных с OLX...`);
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                Version: 2.0,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`[ERROR] [${new Date().toISOString()}] Error fetching OLX data: ${error}`);
        console.error(
            `[ERROR] [${new Date().toISOString()}] getOlxAds: Ошибка details: ${JSON.stringify(error.response?.data)}`
        );
        if (error.response && error.response.status === 401) {
            throw new Error('Invalid token')
        }
        throw new Error("Error fetching data from OLX API.");
    }
}

module.exports = {
    getTokenOlx,
    fetchOlxData,
};



