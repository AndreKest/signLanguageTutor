import React from 'react';
import { Container, Grid, Button, Typography, Paper } from '@mui/material';

// MainMenu component
export default function MainMenu({ onStartMode }) {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h2" gutterBottom>Welcome!</Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mb: 6 }}>
        Choose a mode to start learning.
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Sentence Mode</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Practice signing a complete sentence, one letter at a time.
            </Typography>
            <Button variant="contained" color="secondary" size="large" onClick={() => onStartMode('sentence')}>
              Start Sentence Mode
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Alphabet Mode</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Practice a randomly selected letter from the alphabet.
            </Typography>
            <Button variant="contained" color="secondary" size="large" onClick={() => onStartMode('alphabet')}>
              Start Alphabet Mode
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
