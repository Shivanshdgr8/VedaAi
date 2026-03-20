import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  dueDate: string;
  questionSettings: {
    type: string;
    count: number;
    marks: number;
  }[];
  additionalInstructions: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generatedPaper: any;
  createdAt: Date;
}

const AssignmentSchema: Schema = new Schema({
  title: { type: String, required: true },
  dueDate: { type: String, required: true },
  questionSettings: [{
    type: { type: String, required: true },
    count: { type: Number, required: true },
    marks: { type: Number, required: true }
  }],
  additionalInstructions: { type: String },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  generatedPaper: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
