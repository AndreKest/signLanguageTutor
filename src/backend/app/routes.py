import os
import json

from flask import Flask, jsonify, send_file, Response
from flask_cors import CORS

from .utils import get_random_image_for_letter, gen_frames

app = Flask(__name__)
CORS(app)


# List all available routes
# ToDo
@app.route("/", methods=["GET"])
def getAvailableRoutes():
    return {
        "available routes": [
            "/get_new_alphabet_image"
            "/get_webcam_feed"
            ]
        }


@app.route('/api/alphabet/image/<string:letter>', methods=['GET'])
def get_new_alphabet_image(letter):
    """
    API endpoint to get a random sign language image for a specific letter.
    """
    # Use the model function to get the path to a random image.
    image_path = get_random_image_for_letter(letter)

    if image_path and os.path.exists(image_path):
        # If an image path was found and the file exists, send the file
        # as the response. The browser will render it as an image.
        return send_file(image_path, mimetype='image/png')
    else:
        # If no image is found, return a 404 Not Found error with a JSON message.
        return jsonify({"error": f"Image not found for letter: {letter}"}), 404

@app.route('/api/webcam', methods=['GET'])
def get_webcam_feed():
    """ Streaming route for webcam as MJPEG. """
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
    