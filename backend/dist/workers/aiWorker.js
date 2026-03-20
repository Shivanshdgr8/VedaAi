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
exports.worker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const Assignment_1 = __importDefault(require("../models/Assignment"));
const index_1 = require("../index");
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
exports.worker = new bullmq_1.Worker('ai-generation', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { assignmentId, title, questionSettings, additionalInstructions, fileText } = job.data;
    try {
        yield Assignment_1.default.findByIdAndUpdate(assignmentId, { status: 'processing' });
        index_1.io.emit('assignment-update', { id: assignmentId, status: 'processing' });
        const prompt = `
      You are an expert AI teacher creating an assessment.
      Title: ${title}
      Question Requirements:
      ${JSON.stringify(questionSettings)}
      Additional Instructions: ${additionalInstructions || 'None'}
      Context Material: ${fileText ? fileText.substring(0, 2000) : 'None provided'}

      Generate a structured JSON output of the question paper. Do NOT include markdown code blocks around the JSON.
      The output must exactly follow this JSON schema:
      {
        "sections": [
          {
            "title": "Section A",
            "instruction": "Short Answer Questions",
            "questions": [
              { "text": "What is electricity?", "difficulty": "Easy", "marks": 2 }
            ]
          }
        ]
      }
    `;
        const response = yield ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        let resultText = response.text;
        if (!resultText)
            throw new Error("No response from AI");
        // Clean up markdown if AI added it
        if (resultText.startsWith('\`\`\`json')) {
            resultText = resultText.replace(/\`\`\`json\n?/, '').replace(/\`\`\`\n?$/, '');
        }
        else if (resultText.startsWith('\`\`\`')) {
            resultText = resultText.replace(/\`\`\`\n?/, '').replace(/\`\`\`\n?$/, '');
        }
        const parsedData = JSON.parse(resultText);
        yield Assignment_1.default.findByIdAndUpdate(assignmentId, {
            status: 'completed',
            generatedPaper: parsedData
        });
        index_1.io.emit('assignment-update', { id: assignmentId, status: 'completed' });
    }
    catch (error) {
        console.error('Job Failed:', error.message);
        yield Assignment_1.default.findByIdAndUpdate(assignmentId, { status: 'failed' });
        index_1.io.emit('assignment-update', { id: assignmentId, status: 'failed' });
        throw error;
    }
}), { connection: redis_1.redisConnection });
exports.worker.on('completed', job => {
    console.log(`Job ${job.id} has completed!`);
});
exports.worker.on('failed', (job, err) => {
    console.error(`Job ${job === null || job === void 0 ? void 0 : job.id} has failed with ${err.message}`);
});
