import os
import random

import cv2

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGE_BASE_DIR = os.path.join(BASE_DIR, 'static', 'images')
print(IMAGE_BASE_DIR)

_LAST_IMAGE = ""

def get_random_image_for_letter(letter: str) -> str | None:
    """ Finds a random image for a given letter from the filesystem 

    Args:
        letter (str): The letter to find an image for.

    Returns:
        str: The path to the random image file.
    """
    try: 
        global _LAST_IMAGE

        # Santize inout and create the path to the letter's directory
        letter = letter.upper()
        letter_dir = os.path.join(IMAGE_BASE_DIR, letter)

        # Check if directory exists and is a directory
        if not os.path.exists(letter_dir) or not os.path.isdir(letter_dir):
            print(f"Error: Directory not found for letter '{letter}' at {letter_dir}")
            return None

        # Get a list of all image files in the directory
        image_files = [f for f in os.listdir(letter_dir) if f.endswith(('.png', '.jpg', '.jpeg'))]
        if not image_files:
            return
        
        # Get a list of all image files in the directory.
        images = [f for f in os.listdir(letter_dir) if os.path.isfile(os.path.join(letter_dir, f))]
        print(images)

        # If there are images, choose one at random.
        if images:
            # Pick random image
            random_image = random.choice(images)

            # Retry if the same image was selected
            while _LAST_IMAGE == random_image:
                random_image = random.choice(images)

            _LAST_IMAGE = random_image
            return os.path.join(letter_dir, random_image)
        else:
            print(f"Warning: No images found for letter '{letter}' in {letter_dir}")
            return None
        
    except Exception as e:
        print(f"Error occurred while fetching image for letter {letter}: {e}")
        return None
    

def gen_frames():
    """ Get the webcam feed. """
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return None
    
    while True:
        success, frame = cap.read()
        if not success:
            break

        # Encode frame as JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            continue

        frame_bytes = buffer.tobytes()
        # Yield frame in multipart/x-mixed-replace format
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')


    cap.release()    

if __name__ == "__main__":
    # Example usage
    letter = 'A'
    image_path = get_random_image_for_letter(letter)
    
    if image_path:
        print(f"Random image for letter '{letter}': {image_path}")
    else:
        print(f"No image found for letter '{letter}'")