import React, { useState } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    IconButton, 
    Box, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogContentText, 
    DialogActions, 
    Button,
    Tooltip 
} from '@mui/material';
import { School, Info, People, LightModeOutlined, DarkModeOutlined} from '@mui/icons-material';
import universityLogo_light from '../resources/RZ_TH_Logo_Zweizeiler_RGB.svg';
import universityLogo_dark from '../resources/RZ_OTH_Logo_Zweizeiler_RGB_neg.svg';

// Header component
export default function Header({ onToggleColorMode, themeMode }) {
  // State for controlling the visibility of the Info dialog
  const [infoOpen, setInfoOpen] = useState(false);
  // State for controlling the visibility of the Credits dialog
  const [creditsOpen, setCreditsOpen] = useState(false);

  // Handlers for Info dialog
  const handleInfoOpen = () => setInfoOpen(true);
  const handleInfoClose = () => setInfoOpen(false);

  // Handlers for Credits dialog
  const handleCreditsOpen = () => setCreditsOpen(true);
  const handleCreditsClose = () => setCreditsOpen(false);

  return (
    <>
      <AppBar position="static">
        <Toolbar> 
          {/* Application Title */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <School sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Sign Language Tutor
            </Typography>
          </Box>

          {/* University Logo and Name */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <img 
              src={universityLogo_dark}
              alt="University Logo" 
              style={{ height: '50px' }} 
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {/* Theme Toggle Button */}
            <Tooltip title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}>
              <IconButton sx={{ ml: 1 }} onClick={onToggleColorMode} color="inherit">
                {themeMode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
              </IconButton>
            </Tooltip>
            
            {/* Info Button */}
            <Tooltip title="About the Application">
              <IconButton sx={{ ml: 1 }} onClick={handleInfoOpen} color="inherit">
                <Info />
              </IconButton>
            </Tooltip>

            {/* Credits Button */}
            <Tooltip title="View Credits">
              <IconButton sx={{ ml: 1 }} onClick={handleCreditsOpen} color="inherit">
                <People />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Info Dialog */}
      <Dialog open={infoOpen} onClose={handleInfoClose}>
        <DialogTitle>About Sign Language Tutor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This application helps you learn American Sign Language (ASL).
            <br /><br />
            <strong>Sentence Mode:</strong> Practice signing full sentences, letter by letter.
            <br />
            <strong>Alphabet Mode:</strong> Practice individual letters presented randomly.
            <br /><br />
            The camera feed shows your hand movements, and the application provides feedback on your signs.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInfoClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Credits Dialog */}
      <Dialog open={creditsOpen} onClose={handleCreditsClose}>
        <DialogTitle>Credits</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This application was developed by employees at the Ostbayerische Technische Hochschule Amberg-Weiden.
            <br /><br />
            <strong>Development Team:</strong>
            <br />- André Kestler
            <br />- Jan Schuster
            <br />- Darren Fürst
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreditsClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
