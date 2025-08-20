import React, { useState, useEffect } from 'react';

import { Grid, Paper, Typography, Button, Box, Card, CardMedia, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';

import { fetchNewImageForLetter } from './apiService';
import WebcamFeed from "./WebcamFeed";

// =================================================================================================
// Constants
// =================================================================================================

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];     // Helper function to get a random item from an array

export default function AlphabetMode({ onGoToMenu }) {

    // ==================================================
    // State Management
    // ==================================================
    const [currentLetter, setCurrentLetter] = useState('');
    const [signImageUrl, setSignImageUrl] = useState('');
    const [detectedClass, setDetectedClass] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);

    // Error snackbar state
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Queue for multiple success messages
    const [messages, setMessages] = useState([]);

    // ==================================================
    // Helper
    // ==================================================
    const classToLetter = (cls) => {
        if (!cls || cls < 1 || cls > 26) return "?";
        return alphabet[cls - 1];
    };

    // ==================================================
    // API Communication
    // ==================================================
    const fetchAndSetSignImage = (letter) => {
        if (!letter) return;

        fetchNewImageForLetter(letter)
            .then(imageUrl => setSignImageUrl(imageUrl))
            .catch(error => {
                console.error('Error fetching image:', error);
                setSignImageUrl('https://placehold.co/600x400/eee/000?text=Error');
                setErrorMessage("Backend is not available. Please try again later.");
                setErrorOpen(true);
            });
    };

    // ==================================================
    // Event Handlers
    // ==================================================
    const handleGetAnotherImage = () => fetchAndSetSignImage(currentLetter);

    const handleNextLetter = () => {
        const newLetter = getRandomItem(alphabet);
        setCurrentLetter(newLetter);
        setSuccessOpen(false);
        setDetectedClass(null);
    };

    const addMessage = (letter, type) => {
        const id = Date.now() + Math.random(); // unique id
        setMessages(prev => [...prev, { id, letter, type }]);

        // Remove this specific message after 4 seconds
        setTimeout(() => {
            setMessages(prev => prev.filter(m => m.id !== id));
        }, 4000);
    };

    const handleDetection = (cls) => {
        setDetectedClass(cls);
        const detectedLetter = classToLetter(cls);

        if (detectedLetter === currentLetter) {
            addMessage(detectedLetter, 'success'); // green
            setSuccessOpen(true);
        } else if (detectedLetter !== currentLetter && detectedLetter !== "?") {
            addMessage(detectedLetter, 'error'); // red
        }
    };


    // ==================================================
    // Lifecycle Effects
    // ==================================================
    useEffect(() => {
        setCurrentLetter(getRandomItem(alphabet));
    }, []);

    useEffect(() => {
        if (currentLetter) {
            fetchAndSetSignImage(currentLetter);
        }
    }, [currentLetter]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 2 }}>
            <Grid container spacing={3} sx={{ justifyContent: 'center', maxWidth: '1200px' }}>
                {/* Static letter image */}
                <Grid item xs={12} sm={6} md={5}>
                    <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <CardMedia 
                            component="img" 
                            image={signImageUrl} 
                            alt={`Sign for ${currentLetter}`} 
                            sx={{ height: 350, objectFit: 'contain', p: 2, backgroundColor: 'background.paper' }} 
                            onError={(e) => { 
                                e.target.src='https://placehold.co/600x400/eee/000?text=Not+Found'; 
                                setErrorMessage("Sign image not found."); 
                                setErrorOpen(true);
                            }} 
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
                                Make the sign for: <strong style={{ fontSize: '2rem' }}>{currentLetter}</strong>
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'center' }}>
                            <Button size="small" onClick={handleGetAnotherImage}>Get Another Image</Button>
                        </CardActions>
                    </Card>
                </Grid>
                {/* ============== */}
                {/* Webcam feed */}
                <Grid item xs={12} sm={6} md={5}>
                    <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <WebcamFeed onDetections={(dets) => {
                            if (dets.length > 0 && dets[0].class !== null) handleDetection(dets[0].class);
                            else handleDetection(null);
                        }}/>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant='h5' component='div' sx={{ textAlign: 'center' }}>Your Camera</Typography>
                            <Typography variant='body2' color="text.secondary" sx={{ textAlign: 'center' }}>The model will detect your hand sign here.</Typography>
                            <Typography gutterBottom variant='h5' align='center'>
                                {detectedClass ? `Detected: ${classToLetter(detectedClass)}` : "Waiting for detection..."}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            {/* ============== */}
            {/* Buttons */}
            <Paper sx={{ p: 2, display:'flex', justifyContent: 'center', gap: 2}}>
                <Button variant='outlined' color='error' onClick={onGoToMenu}>Stop & Go to Menu</Button>
                <Button variant='contained' color='success' onClick={handleNextLetter}>Next Letter</Button>
            </Paper>
            {/* ============== */}
            {/* Success Dialog */}
            <Dialog open={successOpen} onClose={() => setSuccessOpen(false)}>
                <DialogTitle>Congratulations!</DialogTitle>
                <DialogContent>
                    <Typography>You made the correct character: <b>{currentLetter}</b></Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onGoToMenu} color="error">Go to Menu</Button>
                    <Button onClick={handleNextLetter} color="success">Next Letter</Button>
                </DialogActions>
            </Dialog>
            {/* ============== */}
            {/* Error Snackbar */}
            <Snackbar 
                open={errorOpen} 
                autoHideDuration={4000} 
                onClose={() => setErrorOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setErrorOpen(false)} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            {/* Success Snackbars */}
            {messages.map((msg, index) => (
                <Snackbar
                    key={msg.id}
                    open={true}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    sx={{ mb: `${index * 60}px` }} // stack upwards
                >
                    <Alert
                        severity={msg.type} // "success" or "error"
                        sx={{ width: '100%' }}
                    >
                        {msg.type === 'success' ? 'Correct' : 'Wrong'} letter detected: <b>{msg.letter}</b>
                    </Alert>
                </Snackbar>
            ))}
        </Box>
    );
}


