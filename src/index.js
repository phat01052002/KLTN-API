import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import { initApplication } from './config/index.js';
import path from 'path';
import { Server } from 'socket.io'; // Import socket.io
import http from 'http'; // Import http
import winston from 'winston';
import cron from 'node-cron';
import fs from 'fs';

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
// app.use((req, res, next) => {
//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     console.log(`Địa chỉ IP vừa truy cập: ${ip}`);
//     next(); // Tiếp tục xử lý yêu cầu
// });
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

// /////////////// socket.io
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: '*', // Hoặc địa chỉ cụ thể của frontend, nếu cần
//         methods: ['GET', 'POST'],
//     },
// });

// // Lắng nghe sự kiện từ Socket.IO
// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });
////////////////LOG
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: 'search.log' })],
});
/////auto remove log
function cleanOldLogs() {
    const logFilePath = path.join(process.cwd(), 'search.log');
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 day before
    // read log
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading log file:', err);
            return;
        }
        // analys
        const logs = data.split('\n').filter((line) => line.trim() !== '');
        const filteredLogs = logs.filter((line) => {
            const log = JSON.parse(line);
            return new Date(log.timestamp) > oneMonthAgo;
        });
        // write
        fs.writeFile(logFilePath, filteredLogs.join('\n'), 'utf8', (err) => {
            if (err) {
                console.error('Error writing log file:', err);
            } else {
                console.log('Old logs have been cleaned up successfully.');
            }
        });
    });
}

// remove on 00:00
cron.schedule('0 0 * * *', () => {
    console.log('Cleaning old logs...');
    cleanOldLogs();
});
/////////////////////////////
initApplication(app);

app.listen(port, () => {
    console.log(`KLTN-API listening on port ${port}`);
});
