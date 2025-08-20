import React, { useEffect, useRef, useState } from "react";

export default function WebcamFeed({ onDetections }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detections, setDetections] = useState([]);

  // Start Camera and stop when unmounted with return
  useEffect(() => {
    let stream;

    async function initCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera not available:", err);
        if (onCameraError) onCameraError("Camera not available or permission denied.");
      }
    }

    initCamera();

    // Cleanup: Stream stoppen, wenn Component unmountet
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Send frame every second to backend
  useEffect(() => {
    const interval = setInterval(() => {
      if (!videoRef.current) return;

      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const formData = new FormData();
        formData.append("frame", blob, "frame.jpg");

        try {
          const response = await fetch("http://127.0.0.1:5000/api/process-frame", {
            method: "POST",
            body: formData,
          });
          if (response.ok) {
            const data = await response.json();
            setDetections(data.detections);

            // Callback to parent component
            if (onDetections) {
              onDetections(data.detections);
            }
          }
        } catch (err) {
          console.error("Error sending frame:", err);
        }
      }, "image/jpeg");
    }, 1000);

    return () => clearInterval(interval);
  }, [onDetections]);

  // Bounding Boxes zeichnen
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    detections.forEach((det) => {
      if (!det.bbox || det.class === null) return; //if no detection, draw nothing

      const [x1, y1, x2, y2] = det.bbox;

      // Flip (horizontal flip)
      const mirroredX1 = canvasRef.current.width - x2;
      const mirroredX2 = canvasRef.current.width - x1;

      ctx.strokeStyle = "lime";
      ctx.lineWidth = 2;
      ctx.strokeRect(mirroredX1, y1, mirroredX2 - mirroredX1, y2 - y1);

      ctx.fillStyle = "lime";
      ctx.font = "16px Arial";
      ctx.fillText(`${det.class} (${det.confidence})`, mirroredX1, y1 - 5);
    });
  }, [detections]);

  return (
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px", transform: "scaleX(-1)" }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: "12px",
        }}
      />
    </div>
  );
}