import React, {useState, useEffect} from "react";
import { Grid, Paper, Typography, Button, Box, Card, CardMedia, CardContent, CardActions, alpha } from '@mui/material';
import { fetchNewImageForLetter  } from './apiService';
import { TypeSpecimenOutlined } from "@mui/icons-material";

// =================================================================================================
// Constants
// =================================================================================================
const sentences = [
  "THE QUICK BROWN FOX",
  "HELLO WORLD",
  "PRACTICE MAKES PERFECT"
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];     // Helper function to get a random item from an array



export default function SentenceMode({ onGoToMenu }) {
    // ==================================================
    // State Management
    // ==================================================
    const [currentSentence, setCurrentSentence] = useState('');
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [signImageUrl, setSignImageUrl] = useState('');
    const [webcamImageUrl, setWebcamImageUrl] = useState('https://placehold.co/600x400/222/fff?text=Webcam+Feed');
  
    const currentLetter = currentSentence[currentLetterIndex];

    // ==================================================
    // API Communication
    // ==================================================
    const fetchAndSetSignImage = (letter) => {
        if (!letter) return;

        console.log("Fetching sign image for letter:", letter);
        fetchNewImageForLetter(letter)
            .then(imageUrl => setSignImageUrl(imageUrl))
            .catch(error => {
                console.log("Error fetching image:", error);
                setSignImageUrl('https://placehold.co/600x400/eee/000?text=Error');
            });

    };

    // ==================================================
    // Event Handlers
    // ==================================================
    const handleGetAnotherImage = () => fetchAndSetSignImage(currentLetter);

    const handleNextLetter = () => {
        let nextIndex = currentLetterIndex + 1;

        // Skip spaces
        while (nextIndex < currentSentence.length && currentSentence[nextIndex] === ' ') {
            // console.log("Skipping space at index: ", nextIndex);
            nextIndex++;
        }

        if (currentLetterIndex < currentSentence.length - 1) {
            setCurrentLetterIndex(nextIndex);
            fetchAndSetSignImage(currentSentence[nextIndex]);
        } else {
            // Back to main menu
            onGoToMenu();
        }
    }


    // ==================================================
    // Lifecycle Effects
    // ==================================================
    useEffect(() => {
        const sentence = getRandomItem(sentences);
        setCurrentSentence(sentence);
        setCurrentLetterIndex(0);
        fetchAndSetSignImage(sentence[0]);

        const intervalId = setInterval(() => {
            setWebcamImageUrl(`https://placehold.co/600x400/222/fff?text=Webcam+${new Date().getTime()}`);
        }, 2000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 2}}>
            {/* Sentence Overview */}
            <Paper elevation={2} sx={{ p:2, mb: 2, width: '100%', maxWidth: '1200px', textAlign: 'center'}}>
                <Typography variant="h4">
                    {currentSentence.split('').map((char, index) => (
                        <span key={index} style={{ fontWeight: index === currentLetterIndex ? 'bold': 'normal', color: index === currentLetterIndex ? '#00679f': 'inherit', textDecoration: index === currentLetterIndex ? 'underline' : 'none', margin: '0 2px'}}>
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </Typography>
            </Paper>
            {/* ============== */}
            {/* Images (Static Image and Webcam Feed) */}
            <Grid container spacing={3} sx={{ justifyContent: 'center', maxWidth: '1200px' }}>
                <Grid item xs={12} sm={6} md={5}>
                    {/* Static letter image */}
                    <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'background.paper' }}>
                        <CardMedia component='img' image={signImageUrl}  alt={`Sign for ${currentLetter}`} sx={{ height: 350, objectFit: 'contain', p: 2, backgroundColor: 'background.paper' }} onError={(e) => { e.target.src='https://placehold.co/600x400/eee/000?text=Not+Found'; }}/>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant='h5' component='div' sx={{ textAlign: 'center' }}>
                                Make the sign for <strong style={{ fontSize: '2rem' }}>{currentLetter}</strong>
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'center' }}>
                            <Button size='small' onClick={handleGetAnotherImage}>Get Another Image</Button>
                        </CardActions>
                    </Card>
                </Grid>
                {/* ============== */}
                {/* Webcam feed */}
                <Grid item xs={12} sm={6} md={5}>
                    <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardMedia component='img' image={webcamImageUrl} alt='Webcam feed' sx={{ height: 350, objectFit: 'cover', backgroundColor: 'background.paper' }} onError={(e) => { e.target.src='https://placehold.co/600x400/eee/000?text=Not+Found'; }}/>
                        <CardContent sx={{ flexGrow: 1}}>
                            <Typography gutterBottom variant='h5' component='div' sx={{ textAlign:  'center'}}>Your Camera</Typography>
                            <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center' }}>The model will detect your hand sign here.</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* ============== */}
            </Grid>
            {/* ============== */}
            {/* Buttons */}
            <Paper sx={{ p: 2, dispaly: 'flex', 'justifyContent': 'center', gap: 2}}>
                <Button variant='outlined' color='error' onClick={onGoToMenu}>Stop & Go to Menu</Button>
                <Button variant='contained' color='success' onClick={handleNextLetter}>Next letter</Button>
            </Paper>
            {/* ============== */}

        </Box>
    );
}
