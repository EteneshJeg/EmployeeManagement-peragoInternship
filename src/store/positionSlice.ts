import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, addDoc, getDocs, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { RootState } from './store'; // Adjust the path according to your actual Redux store setup

interface Position {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
}

interface PositionState {
  positions: Position[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PositionState = {
  positions: [],
  status: 'idle',
  error: null,
};

// Async Thunks
export const fetchPositions = createAsyncThunk('positions/fetchPositions', async () => {
  const q = query(collection(db, 'positions'));
  const querySnapshot = await getDocs(q);
  const positions: Position[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    positions.push({ id: doc.id, name: data.name, description: data.description, parentId: data.parentId });
  });
  return positions;
});

export const addPositionAsync = createAsyncThunk('positions/addPositionAsync', async (position: Omit<Position, 'id'>) => {
  const docRef = await addDoc(collection(db, 'positions'), position);
  return { id: docRef.id, ...position };
});

export const updatePositionAsync = createAsyncThunk('positions/updatePositionAsync', async (position: Position) => {
  const { id, ...data } = position;
  const positionRef = doc(db, 'positions', id);
  await updateDoc(positionRef, data);
  return position;
});

export const deletePositionAsync = createAsyncThunk('positions/deletePositionAsync', async (id: string) => {
  const positionRef = doc(db, 'positions', id);
  await deleteDoc(positionRef);
  return id;
});

// Selectors
export const selectPositions = (state: RootState) => state.positions.positions;
export const selectStatus = (state: RootState) => state.positions.status;

// Slice definition
export const positionSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPositions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPositions.fulfilled, (state, action: PayloadAction<Position[]>) => {
        state.status = 'succeeded';
        state.positions = action.payload;
      })
      .addCase(fetchPositions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addPositionAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addPositionAsync.fulfilled, (state, action: PayloadAction<Position>) => {
        state.status = 'succeeded';
        state.positions.push(action.payload);
      })
      .addCase(addPositionAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(updatePositionAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePositionAsync.fulfilled, (state, action: PayloadAction<Position>) => {
        state.status = 'succeeded';
        const index = state.positions.findIndex(pos => pos.id === action.payload.id);
        if (index !== -1) {
          state.positions[index] = action.payload;
        }
      })
      .addCase(updatePositionAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(deletePositionAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletePositionAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.positions = state.positions.filter(position => position.id !== action.payload);
      })
      .addCase(deletePositionAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

// Export reducer and actions
export default positionSlice.reducer;
export const positionsApi = {
  reducer: positionSlice.reducer,
  ...positionSlice.actions,
};
