import { configureStore } from '@reduxjs/toolkit';
import positionReducer from './positionSlice'; // Adjust the import path as necessary
import { positionsApi } from './positionSlice'; // Assuming positionsApi.middleware is used

const store = configureStore({
  reducer: {
    positions: positionReducer,
    // Add other reducers here if needed
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(positionsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
