// functions/config.js
const functions = require('firebase-functions');

const CLIENT_ID = process.env.OLX_CLIENT_ID || '202115';
const CLIENT_SECRET = process.env.OLX_CLIENT_SECRET || 'oR3rmPGlXWgtPTXlmwI1dt2wiKMtcZAUM3SaEnD3WvGpwvmY';

module.exports = {
    CLIENT_ID,
    CLIENT_SECRET
};
