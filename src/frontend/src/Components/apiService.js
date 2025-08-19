const API_BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * Fetches a new sign language image for a given letter
 * @param {string} letter - The letter for which to fetch the sign image
 * @returns {Promise<string>} - A promise that resolves to the URL of the sign image
 */
export const fetchNewImageForLetter = (letter) => {
    return fetch(`${API_BASE_URL}/alphabet/image/${letter}`)
        .then(response => {
            if (!response.ok) {
                // If the server respose with an error, throw an error to be caught later
                throw new Error('Network response was not ok');
            }
            // The response is a blob (raw image data)
            return response.blob();
        })
        .then(imageBlob => {
            // Create a temporary, usable URL from the blob data
            return URL.createObjectURL(imageBlob);
        });
};