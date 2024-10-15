import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import { initApplication } from './config/index.js';
import path from 'path';
import { Server } from 'socket.io'; // Import socket.io
import http from 'http'; // Import http

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

/////////////// socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Hoặc địa chỉ cụ thể của frontend, nếu cần
        methods: ['GET', 'POST'],
    },
});

// Lắng nghe sự kiện từ Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
////////////////
initApplication(app);

app.listen(port, () => {
    console.log(`KLTN-API listening on port ${port}`);
});




