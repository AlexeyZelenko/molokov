// functions/middleware.js
const functions = require('firebase-functions');

async function verifyToken(req, res) {
    return new Promise((resolve, reject) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.error(`[ERROR] [${new Date().toISOString()}] Missing token.`);
            res.status(401).json({ error: 'Token not provided.' });
            return reject(new Error('Token not provided'));
        }
        req.token = token;
        resolve();
    });
}

module.exports = {
    verifyToken
};
