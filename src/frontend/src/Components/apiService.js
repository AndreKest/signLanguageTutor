const API_BASE_URL = 'http://127.0.0.1:5000/api';

export const fetchNewImageForLetter = async (letter) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 sec timeout

    try {
        console.log("📡 Fetching from:", `${API_BASE_URL}/alphabet/image/${letter}`);
        const response = await fetch(`${API_BASE_URL}/alphabet/image/${letter}`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const imageBlob = await response.blob();
        return URL.createObjectURL(imageBlob);

    } catch (error) {
        console.error("fetchNewImageForLetter failed:", error);
        throw error; // propagate to AlphabetMode
    }
};




