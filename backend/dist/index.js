"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const assignment_1 = __importDefault(require("./routes/assignment"));
require("./workers/aiWorker");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: frontendUrl === '*' ? '*' : [frontendUrl, 'http://localhost:3000'],
        methods: ['GET', 'POST']
    }
});
app.use((0, cors_1.default)({ origin: frontendUrl === '*' ? '*' : [frontendUrl, 'http://localhost:3000'] }));
app.use(express_1.default.json());
app.use('/api/assignments', assignment_1.default);
exports.io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
const PORT = process.env.PORT || 5000;
(0, db_1.connectDB)().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
