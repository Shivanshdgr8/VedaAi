"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const Assignment_1 = __importDefault(require("../models/Assignment"));
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const aiQueue = new bullmq_1.Queue('ai-generation', { connection: redis_1.redisConnection });
router.post('/', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, dueDate, questionSettings, additionalInstructions } = req.body;
        // Parse JSON string fields from form-data if necessary
        const parsedSettings = typeof questionSettings === 'string' ? JSON.parse(questionSettings) : questionSettings;
        const assignment = new Assignment_1.default({
            title,
            dueDate,
            questionSettings: parsedSettings,
            additionalInstructions,
            status: 'pending'
        });
        yield assignment.save();
        // Add job to BullMQ
        yield aiQueue.add('generate-questions', {
            assignmentId: assignment._id,
            title,
            questionSettings: parsedSettings,
            additionalInstructions,
            fileText: req.file ? req.file.buffer.toString('utf-8') : null
        });
        res.status(201).json({ success: true, assignment });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignments = yield Assignment_1.default.find().sort({ createdAt: -1 });
        res.json({ success: true, assignments });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignment = yield Assignment_1.default.findById(req.params.id);
        if (!assignment) {
            res.status(404).json({ success: false, message: 'Not found' });
            return;
        }
        res.json({ success: true, assignment });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}));
exports.default = router;
