import React from 'react';

import {Box, Typography} from '@material-ui/core';

import { NewsArticle } from './features/newsarticle/NewsArticle';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Typography component={'h3'} variant={'h3'}>{'News Articles'}</Typography>
        <Box mt={3} mb={3}>
          <NewsArticle />
        </Box>
      </header>
    </div>
  );
}

export default App;
