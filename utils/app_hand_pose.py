# Use Yolo for bounding box recognition around hand

import cv2
from ultralytics import YOLO

# Load the YOLO model
model = YOLO(r"D:\Workshops\2025_LNDW\models\best_hand_pose_estimation.pt")

# Open webcam
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Run inference
    results = model(frame)[0]

    # Draw bounding boxes and keypoints
    for box, kp in zip(results.boxes, results.keypoints):
        # Bounding box
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        conf = float(box.conf[0])
        cls = int(box.cls[0])
        label = model.names[cls]

        # Draw bounding box
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        # Put label and confidence
        text = f"{label} {conf:.2f}"
        cv2.putText(frame, text, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX,
                    0.6, (0, 255, 0), 2)

        # Draw keypoints
        # Draw keypoints
        if kp is not None:
            for point in kp.xy[0]:  # keypoints for one detection
                x, y = map(int, point)
                cv2.circle(frame, (x, y), 3, (255, 0, 0), -1)
    # Show the frame
    cv2.imshow("YOLO Live", frame)

    # Break on ESC
    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
