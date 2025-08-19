# Use Yolo for ASL (A, B, C, ..., Z) recognition

import cv2
from ultralytics import YOLO

# Load the YOLO model (make sure the weights file is correct)
#model = YOLO(model="\\\\wsl.localhost\\Ubuntu-24.04\\home\\jan\\projects_local\\yolo\\train\\weights\\best.pt")
model = YOLO(model=r"D:\Workshops\2025_LNDW\models\asl_model_50_epochs.pt")



# Open webcam
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Run inference
    results = model(frame)[0]

    # Draw results
    for box in results.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        conf = float(box.conf[0])
        cls = int(box.cls[0])
        label = model.names[cls]

        # Draw bounding box
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        # Put label and confidence
        text = f"{label} {conf:.2f}"
        cv2.putText(frame, text, (x2 + 5, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX,
                    0.6, (0, 255, 0), 2)

    # Show the frame with size (640, 480)
    frame = cv2.resize(frame, (1280, 960))
    cv2.imshow("YOLO Live", frame)

    # Break on ESC
    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
