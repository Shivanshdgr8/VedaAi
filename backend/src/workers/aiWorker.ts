import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import Assignment from '../models/Assignment';
import { io } from '../index';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const worker = new Worker('ai-generation', async job => {
  const { assignmentId, title, questionSettings, additionalInstructions, fileText } = job.data;
  
  try {
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });
    io.emit('assignment-update', { id: assignmentId, status: 'processing' });

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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    // Clean up markdown if AI added it
    if (resultText.startsWith('\`\`\`json')) {
       resultText = resultText.replace(/\`\`\`json\n?/, '').replace(/\`\`\`\n?$/, '');
    } else if (resultText.startsWith('\`\`\`')) {
       resultText = resultText.replace(/\`\`\`\n?/, '').replace(/\`\`\`\n?$/, '');
    }
    
    const parsedData = JSON.parse(resultText);

    await Assignment.findByIdAndUpdate(assignmentId, { 
      status: 'completed',
      generatedPaper: parsedData 
    });

    io.emit('assignment-update', { id: assignmentId, status: 'completed' });
    
  } catch (error: any) {
    console.error('Job Failed:', error.message);
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
    io.emit('assignment-update', { id: assignmentId, status: 'failed' });
    throw error;
  }
}, { connection: redisConnection as any });

worker.on('completed', job => {
  console.log(`Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} has failed with ${err.message}`);
});
