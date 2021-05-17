import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchNews } from './newsAPI';

export const fetchNewsByPage = createAsyncThunk(
  'news/fetchEverything',
  async (data) => {
    const response = await fetchNews(data),
        respData = await response.json();
        
    return respData;
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState: { article: [], status: 'idle' },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsByPage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNewsByPage.fulfilled, (state, action) => {
        state.status = 'idle';
        state.article = action.payload;
      });
  },
})

export const articles = (state) => {
    return {article: state.newsArticle.article, status: state.newsArticle.status}
};

export default newsSlice.reducer;