import os
import json

from flask import Flask, jsonify, send_file, request
from flask_cors import CORS

from PIL import Image
import io
import numpy as np

from .utils import get_random_image_for_letter
from .model import ASLModel

app = Flask(__name__)
CORS(app)

asl_model = ASLModel(weights_path="models/asl_model_50_epochs.pt", device="cpu")


# List all available routes
# ToDo
@app.route("/", methods=["GET"])
def getAvailableRoutes():
    return {
        "available routes": [
            "/get_new_alphabet_image"
            "/process_frame"
            ]
        }


@app.route('/api/alphabet/image/<string:letter>', methods=['GET'])
def get_new_alphabet_image(letter):
    """
    API endpoint to get a random sign language image for a specific letter.
    """
    print("Letter: ", letter)
    # Use the model function to get the path to a random image.
    image_path = get_random_image_for_letter(letter)

    if image_path and os.path.exists(image_path):
        # If an image path was found and the file exists, send the file
        # as the response. The browser will render it as an image.
        return send_file(image_path, mimetype='image/png')
    else:
        # If no image is found, return a 404 Not Found error with a JSON message.
        return jsonify({"error": f"Image not found for letter: {letter}"}), 404

@app.route("/api/process-frame", methods=["POST", "GET"])
def process_frame():
    if "frame" not in request.files:
        return jsonify({"error": "No frame provided"}), 400

    file = request.files["frame"]
    image_bytes = file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # model process
    detections = asl_model.predict(image, conf_threshold=0.5)

    # # Mock up (for testing purpose)
    # cls = 0
    # conf = 0.9
    # detections = []
    # # Create 4 random int numbers for bbox
    # x1, y1 = np.random.randint(0, 100, size=2)
    # x2, y2 = np.random.randint(100, 300, size=2)
    # detections.append({
    #     "class": int(np.random.randint(0,26, size=1)),
    #     "confidence": 0.9,
    #     "bbox": [int(x1), int(y1), int(x2), int(y2)]
    # })

    return jsonify({"detections": detections})