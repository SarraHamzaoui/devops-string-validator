const express = require('express');
const pinoHttp = require('pino-http');
const pino = require('pino');

const client = require('prom-client');
const app = express();
const port = 5000;

const logger = pino({ name: 'string-validator-api' });

app.use(pinoHttp({ logger }));

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'node_app_' });


const totalRequests = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});


const requestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route'],
    buckets: [0.1, 0.3, 0.5, 1, 3, 5],
});


app.use((req, res, next) => {
    const end = requestDuration.startTimer();

    res.on('finish', () => {
        totalRequests.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode,
        });
        end({
            method: req.method,
            route: req.route ? req.route.path : req.path
        });
    });
    next();
});


function isValidUrl(str) {
    try {
        new URL(str);
        return true;
    } catch (e) {
        return false;
    }
}


app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', client.register.contentType);
        res.end(await client.register.metrics());
    } catch (ex) {
        req.log.error(ex, "Erreur lors de la récupération des métriques");
        res.status(500).end(ex);
    }
});

app.get('/api/v1/validate', (req, res) => {
    const input = req.query.input;

    if (!input) {
        req.log.error({ input: input }, "Missing 'input' query parameter");
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
        logger.info(`Server running at http://0.0.0.0:${port}`);
    });
}

module.exports = { app, server, isValidUrl };