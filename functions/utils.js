// functions/utils.js
const cors = require("cors")({
    origin: ["http://localhost:5173", "https://friendlychat-you-tube-short.web.app", "https://friendlychat-you-tube-short.firebaseapp.com"],
    methods: ["GET", "POST"],
}); // Обработка CORS

module.exports = {
    cors,
};
