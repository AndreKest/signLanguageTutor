import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Button, Box, Card, CardMedia, CardContent, CardActions, alpha } from '@mui/material';
import { fetchNewImageForLetter  } from './apiService';
import WebcamFeed from "./WebcamFeed";


// =================================================================================================
// Constants
// =================================================================================================
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];     // Helper function to get a random item from an array

export default function AlphabetMode({ onGoToMenu }){
    // ==================================================
    // State Management
    // ==================================================
    const [currentLetter, setCurrentLetter] = useState('');
    const [signImageUrl, setSignImageUrl] = useState('');
    const [webcamImageUrl, setWebcamImageUrl] = useState('https://placehold.co/600x400/222/fff?text=Webcam+Feed');

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
        });
    };

    // ==================================================
    // Event Handlers
    // ==================================================
    const handleGetAnotherImage = () => fetchAndSetSignImage(currentLetter);
    const handleNextLetter = () => {
        const newLetter = getRandomItem(alphabet);
        setCurrentLetter(newLetter);
        fetchAndSetSignImage(newLetter);
    };

    // ==================================================
    // Lifecycle Effects
    // ==================================================
    useEffect(() => {
        const firstLetter = getRandomItem(alphabet);    // Get a random letter from the alphabet
        setCurrentLetter(firstLetter);                  // Set letter 
        fetchAndSetSignImage(firstLetter);              // Set static image

        // Webcam image
        const intervalId = setInterval(() => {
            setWebcamImageUrl(`https://placehold.co/600x400/222/fff?text=Webcam+${new Date().getTime()}`);
        }, 2000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 2 }}>
            <Grid container spacing={3} sx={{ justifyContent: 'center', maxWidth: '1200px' }}>
                {/* Static letter image */}
                <Grid item xs={12} sm={6} md={5}>
                    <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <CardMedia component="img" image={signImageUrl} alt={`Sign for ${currentLetter}`} sx={{ height: 350, objectFit: 'contain', p: 2, backgroundColor: 'background.paper' }} onError={(e) => { e.target.src='https://placehold.co/600x400/eee/000?text=Not+Found'; }} />
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
                        <WebcamFeed />
                        {/* <CardMedia component='img' src='http://127.0.0.1:5000/api/webcam' alt="Webcam feed" sx={{ height: 350, objectFit: 'cover', backgroundColor: 'background.paper' }} /> */}
                        {/* <CardMedia component='img' image={webcamImageUrl} alt="Webcam feed" sx={{ height: 350, objectFit: 'cover', backgroundColor: 'background.paper' }} /> */}
                        Card
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant='h5' component='div' sx={{ textAlign: 'center' }}>Your Camera</Typography>
                            <Typography variant='body2' color="text.secondary" sx={{ textAlign: 'center' }}>The model will detect your hand sign here.</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* ============== */}
            </Grid>
            {/* Buttons */}
            <Paper sx={{ p: 2, display:'flex', justifyContent: 'center', gap: 2}}>
                <Button variant='outlined' color='error' onClick={onGoToMenu}>Stop & Go to Menu</Button>
                <Button variant='contained' color='success' onClick={handleNextLetter}>Next Letter</Button>
            </Paper>
            {/* ============== */}
        </Box>
    );
}