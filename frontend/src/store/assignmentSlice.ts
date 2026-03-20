// frontend/src/store/assignmentSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QuestionSetting {
  type: string;
  count: number;
  marks: number;
}

export interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  questionSettings: QuestionSetting[];
  additionalInstructions?: string;
  generatedPaper?: any;
  createdAt: string;
}

interface AssignmentState {
  assignments: Assignment[];
  currentAssignment: Assignment | null;
  loading: boolean;
  error: string | null;
}

const initialState: AssignmentState = {
  assignments: [],
  currentAssignment: null,
  loading: false,
  error: null,
};

export const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    setAssignments: (state, action: PayloadAction<Assignment[]>) => {
      state.assignments = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateAssignmentStatus: (state, action: PayloadAction<{ id: string; status: any }>) => {
      const idx = state.assignments.findIndex((a) => a._id === action.payload.id);
      if (idx !== -1) {
        state.assignments[idx].status = action.payload.status;
      }
      if (state.currentAssignment && state.currentAssignment._id === action.payload.id) {
        state.currentAssignment.status = action.payload.status;
      }
    },
    setCurrentAssignment: (state, action: PayloadAction<Assignment>) => {
      state.currentAssignment = action.payload;
      state.loading = false;
    },
    addAssignment: (state, action: PayloadAction<Assignment>) => {
      state.assignments.unshift(action.payload);
    }
  },
});

export const { setAssignments, setLoading, setError, updateAssignmentStatus, setCurrentAssignment, addAssignment } = assignmentSlice.actions;

export default assignmentSlice.reducer;
