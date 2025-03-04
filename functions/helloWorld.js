const { onRequest } = require("firebase-functions/v2/https");

exports.helloWorld = onRequest({ region: "us-central1" }, (req, res) => {
    console.log("Hello World function was triggered");
    res.send("Hello, World!");
});
