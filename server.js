const express = require('express');
const app = express();
const port = 5000;

function isValidUrl(str) {
    try {
        new URL(str);
        return true;
    } catch (e) {
        return false;
    }
}

app.get('/api/v1/validate', (req, res) => {
    const input = req.query.input;

    if (!input) {
        return res.status(400).json({
            error: "Le paramètre 'input' est requis."
        });
    }

    const is_valid_url = isValidUrl(input);

    res.json({
        input: input,
        is_valid_url: is_valid_url,
        message: is_valid_url ? "La chaîne est une URL valide." : "La chaîne n'est pas une URL valide."
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'StringValidatorAPI' });
});

let server;

if (process.env.NODE_ENV !== 'test') {
    server = app.listen(port, '0.0.0.0', () => {
        console.log(`Server running at http://0.0.0.0:${port}`);
    });
}

// Nous exportons l'application Express pour que les tests puissent utiliser Supertest
module.exports = { app, server, isValidUrl };