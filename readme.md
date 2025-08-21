Names:
- André Kestler
- Jan Schuster
- Darren Fürst


# ASL Alphabet Detection
This project is a full-stack web application designed to recognize and interpret American Sign Language (ASL) for the alphabet. It uses a deep learning model (YOLOv11) to detect hand signs from a video feed in real-time. The frontend is built with React, and the backend is powered by Flask.


# Features
- Sentence Mode: Practice signing a complete sentence, one letter at a time. 
- The current letter to be signed is highlighted, and an example image is provided.
- Alphabet Mode: Practice a randomly selected letter from the alphabet.
- Real-time Feedback: The application uses a webcam to provide real-time feedback on your signs, including bounding boxes and labels for recognized letters.
- Example Images: For each letter, you can view an example image to help you learn the correct hand shape. You can also request a new image if the current one is not helpful.
- Light and Dark Mode: The application includes a theme toggler for light and dark modes.


# Project Structure
The repository is structured as follows:
```
├── data/                 # Contains images and labels for training (Not tracked by Git)
├── src/
│   ├── frontend/         # React frontend application
│   │   ├── .devcontainer # Devcontainer for frontend development
│   │   ├── etc/
│   │   │   └── nginx/
│   │   │       └── nginx.conf
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   ├── favicon.ico
│   │   │   ├── manifest.json
│   │   │   └── apple-touch-icon.png
│   │   ├── src/
│   │   │   ├── Components/ # React components
│   │   │   │   ├── AlphabetMode.js
│   │   │   │   ├── apiService.js
│   │   │   │   ├── Header.js
│   │   │   │   ├── MainMenu.js
│   │   │   │   ├── SentenceMode.js
│   │   │   │   └── WebcamFeed.js
│   │   │   ├── App.js
│   │   │   ├── index.css
│   │   │   └── index.js
│   │   ├── Dockerfile
|   |   ├── .dockerignore
|   |   ├── .gitignore
│   │   └── package.json
│   ├── backend/          # Flask backend application
│   │   ├── .devcontainer # Devcontainer for backend development
│   │   ├── app/          # Main application logic
│   │   │   ├── __init__.py
│   │   │   ├── model.py  # ASLModel class for YOLO inference
│   │   │   ├── routes.py # API endpoint definitions
│   │   │   └── utils.py  # Helper functions
│   │   ├── models/       # Contains the trained model weights (e.g., asl_model_50_epochs.pt)
│   │   ├── static/       # Static assets
│   │   │   └── images/   # Example images for each letter (A-Z)
│   │   │       ├── A/
│   │   │       ├── B/
│   │   │       └── ...
│   │   ├── Dockerfile
│   │   ├── gunicorn_config.py
│   │   ├── main.py
|   |   ├── .dockerignore
|   |   ├── .gitignore
│   │   └── requirements.txt
|   └── docker-compose.yml
└── .gitignore
```

# Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- Docker: Make sure you have Docker installed on your system. You can download it from the official Docker website
Docker Compose: This is included with most Docker installations.

#### Installation & Launch
1. Clone the repository:
    - HTTPS:
        ```
        git clone https://github.com/AndreKest/signLanguageTutor.git
        cd signLanguageTutor
        ```
    - SSH:
        ```
        git clone git@github.com:AndreKest/signLanguageTutor.git
        cd signLanguageTutor
        ```
2. Environment Variables:

    The backend service requires an environment file. Create a file named `backend.env` inside the `./src/backend/` directory. Currently it is empty and not used! But you need to create it! Otherwise it would not start. Take exactly the mentioned name `backend.env`!

3. Model Weights: 
    
    Place your trained model weights file (e.g., asl_model_50_epochs.pt) inside the `./src/backend/models/` directory.

4. Build and run the application:
    
    Use Docker Compose to build the images and start the containers for the frontend and backend services.
    ```
    docker-compose up --build
    ```

Once the containers are running, the frontend will be accessible at `http://localhost:80` and the backend will be running on `http://localhost:5000`.

## Backend
The backend is a Python web application built with the Flask framework. It handles the real-time sign language detection using a YOLOv11 model and exposes API endpoints for the frontend.

### Key Technologies
- Flask: A lightweight WSGI web application framework in Python.
- Gunicorn: A Python WSGI HTTP Server for UNIX.
- Ultralytics YOLOv11: The machine learning model used for object detection, specifically trained to recognize ASL alphabet signs.
- OpenCV: Used for computer vision tasks.
- Pillow (PIL): For image manipulation.

### API Endpoints
The backend provides the following RESTful API endpoints:
- GET /api/alphabet/image/<string:letter>
    - Retrieves a random example image of a specific letter's sign.
    - URL Params: letter=[A-Z]
    - Success Response: Returns an image file (image/png).
    - Error Response: Returns a 404 error if no image is found for the specified letter.
- POST /api/process-frame
    - Processes a single image frame (from a webcam feed) and returns any detected ASL signs.
    - Request Body: multipart/form-data with a key frame containing the image file.
    - Success Response: Returns a JSON object with a list of detections. Each detection includes the class index, confidence score, and bounding box coordinates.
    ```
    {
        "detections": [
        {
        "class": 1,
        "confidence": 0.95,
        "bbox": [x1, y1, x2, y2]
            }
        ]
    }
    ```
    - Error Response: Returns a 400 error if no frame is provided in the request.
        
### Dependencies
All Python dependencies are listed in the `requirements.txt` file:
- numpy
- matplotlib
- opencv-python
- Flask
- flask_cors
- gunicorn
- requests
- ultralytics
- python-dotenv

## Frontend
The frontend is a modern web application built using **React** and **Material-UI**. It is created with Create React App and served by an Nginx web server in the production environment.

### Key Technologies
- React: A JavaScript library for building user interfaces.
- React Scripts: Configuration and scripts for Create React App.
- Material-UI (MUI): A popular React UI framework for faster and easier web development.
- Nginx: Used as the web server for the production build of the React application.

### Nginx Configuration
The `nginx.conf` file is configured to serve the static React build. It uses `try_files $uri $uri/ /index.html` to ensure that all routes are correctly handled by the React Router on the client side, which is standard practice for single-page applications.

### Dependencies
Key frontend dependencies from `package.json`:
- @emotion/react
- @emotion/styled
- @mui/icons-material
- @mui/material
- react
- react-dom
- react-scripts

## Development Environment
This project uses Dev Containers for a consistent and isolated development environment. Both the `frontend` and `backend` directories contain their own `.devcontainer` configuration.

To use the devcontainer:
1. Open the project in Visual Studio Code.
2. Add `/backend/.devcontainer` `devcontainer.env` file (Currently it is empty and not used! But you need to create it! Otherwise it would not start. Take exactly the mentioned name `devcontainer.env`!) 
3. Make sure you have the Dev Containers extension installed.
4. When prompted, choose "Reopen in Container". You can select to open either the frontend or the backend devcontainer.

This will build and start the development container, allowing you to develop inside a sandboxed environment with all the necessary tools and dependencies pre-installed.

## Future Development
- Error Handling (No Available Webcam, No Yolo available)
- German Sign Language Handling
- Expand to include the entire language (not just letters for spelling)
