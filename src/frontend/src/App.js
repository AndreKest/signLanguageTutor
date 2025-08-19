import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Header from './Components/Header';
import MainMenu from './Components/MainMenu';
import SentenceMode from './Components/SentenceMode';
import AlphabetMode from './Components/AlphabetMode';

// Default export for the main App component
export default function App() {
  // State to manage the application's current view ('menu', 'sentence', 'alphabet')
  const [mode, setMode] = useState('menu'); // 'menu', 'sentence', or 'alphabet'
  // State to manage the color theme (light or dark)
  const [themeMode, setThemeMode] = useState('light');

  // Memoized theme creation to avoid recalculating on every render
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: {
            main: '#ee7100', // Orange
          },
          secondary: {
            main: '#00679f', // Blue
          },
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
        },
      }),
    [themeMode]
  );

  // Function to toggle the color theme
  const toggleColorMode = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Function to start a learning mode
  const handleStartMode = (selectedMode) => {
    if (selectedMode === 'sentence' || selectedMode === 'alphabet') {
      setMode(selectedMode);
    }
  };

  // Function to return to the main menu
  const handleGoToMenu = () => {
    setMode('menu');
  };

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline provides a consistent baseline style across browsers */}
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'background.default' }}>
        {/* Header component is always visible */}
        <Header onToggleColorMode={toggleColorMode} themeMode={themeMode}/>

        <Box component="main" sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
          {mode === 'menu' && <MainMenu onStartMode={handleStartMode} />}
          {mode === 'alphabet' && <AlphabetMode onGoToMenu={handleGoToMenu} />}
          {mode === 'sentence' && <SentenceMode onGoToMenu={handleGoToMenu} />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
