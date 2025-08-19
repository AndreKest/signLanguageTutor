// import React, { useEffect, useRef } from "react";
// import { CardMedia } from "@mui/material";

// export default function WebcamFeed() {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     async function initCamera() {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (err) {
//         console.error("Kamera-Zugriff verweigert oder nicht verfügbar:", err);
//       }
//     }
//     initCamera();
//   }, []);

//   return (
//     <CardMedia
//       component="video"
//       ref={videoRef}
//       autoPlay
//       playsInline
//       muted
//       sx={{ height: 350, objectFit: "cover", backgroundColor: "background.paper" }}
//     />
//   );
// }

import React, { useEffect, useRef, useState } from "react";

export default function WebcamFeed() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detections, setDetections] = useState([]);

  // Kamera starten
  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Kamera-Zugriff verweigert oder nicht verfügbar:", err);
      }
    }
    initCamera();
  }, []);

  // Alle 1 Sekunde ein Frame an Backend schicken
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
          }
        } catch (err) {
          console.error("Error sending frame:", err);
        }
      }, "image/jpeg");
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Bounding Boxes zeichnen
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    detections.forEach((det) => {
      const [x1, y1, x2, y2] = det.bbox;
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

      ctx.fillStyle = "lime";
      ctx.font = "16px Arial";
      ctx.fillText(`${det.class} (${det.confidence})`, x1, y1 - 5);
    });
  }, [detections]);

  return (
    <div style={{ position: "relative", width: "100%", height: "350px" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
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
