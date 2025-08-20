from ultralytics import YOLO
import numpy as np
from PIL import Image


class ASLModel:
    def __init__(self, weights_path="models/asl_model.pt", device="cpu"):
        """ Loading YOLO11 model for ASL detection 
        
        Args:
            weights_path (str): Path to the model weights file.
            device (str): Device to run the model on (e.g., "cpu" or "cuda").
        """
        self.device = device
        self.model = YOLO(weights_path)

    def predict(self, image: Image.Image, conf_threshold=0.5):
        """ Run inference on the input image.

        Args:
            image (Image.Image): The input image to process.
        """
        results = self.model.predict(
            image,
            device=self.device,
            conf=conf_threshold,
            verbose=False
        )
        
        detections = []
        for result in results:  # Detect more than one 
            boxes = result.boxes.cpu().numpy()  # load to cpu
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].astype(int)  # Bounding Box
                cls = int(box.cls[0])                     # Class index
                conf = float(box.conf[0])                 # Confidence
                detections.append({
                    "class": cls + 1,
                    "confidence": conf,
                    "bbox": [int(x1), int(y1), int(x2), int(y2)]
                })

        if not detections:
            return [{"class": None, "confidence": 0.0, "bbox": None}] 

        return detections