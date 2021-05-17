import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import newsReducer from '../features/newsarticle/newsSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    newsArticle: newsReducer
  },
});
