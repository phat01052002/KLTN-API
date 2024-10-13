import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import { initApplication } from './config/index.js';
import path from 'path';

const app = express();
const port = process.env.PORT || 3035;

app.use(
    cors({
        origin: '*',
        optionsSuccessStatus: 200,
        allowedHeaders: ['Authorization', 'Content-Type'],
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    }),
);
app.use(express.static('static/assets'));
app.use(express.static('uploads'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(function (err, req, res, next) {
    console.error(err.stack);
    return res.set(err.headers).status(err.status).json({ message: err.message });
});

app.get('/', (req, res) => {
    res.status(httpStatus.OK).json({
        message: 'hello-prisma-KLTN-API',
    });
});

initApplication(app);

app.listen(port, () => {
    console.log(`KLTN-API listening on port ${port}`);
});
