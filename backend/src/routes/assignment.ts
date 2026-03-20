import { Router, Request, Response } from 'express';
import multer from 'multer';
import Assignment from '../models/Assignment';
import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const aiQueue = new Queue('ai-generation', { connection: redisConnection as any });

router.post('/', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, dueDate, questionSettings, additionalInstructions } = req.body;
    
    // Parse JSON string fields from form-data if necessary
    const parsedSettings = typeof questionSettings === 'string' ? JSON.parse(questionSettings) : questionSettings;

    const assignment = new Assignment({
      title,
      dueDate,
      questionSettings: parsedSettings,
      additionalInstructions,
      status: 'pending'
    });

    await assignment.save();

    // Add job to BullMQ
    await aiQueue.add('generate-questions', {
      assignmentId: assignment._id,
      title,
      questionSettings: parsedSettings,
      additionalInstructions,
      fileText: req.file ? req.file.buffer.toString('utf-8') : null 
    });

    res.status(201).json({ success: true, assignment });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/', async (req: Request, res: Response): Promise<void>  => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json({ success: true, assignments });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void>  => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Not found' });
      return;
    }
    res.json({ success: true, assignment });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
