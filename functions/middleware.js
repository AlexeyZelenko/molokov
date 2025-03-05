// functions/middleware.js

const functions = require("firebase-functions");

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        console.error(`[ERROR] [${new Date().toISOString()}] Missing token.`);
        return res.status(401).json({ error: "Token not provided." });
    }
    req.token = token;
    next();
}

module.exports = {
    verifyToken,
};
