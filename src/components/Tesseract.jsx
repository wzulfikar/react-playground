import React, { useState, useRef } from "react";

import useTesseract from "../hooks/useTesseract";
import useCamera from "../hooks/useCamera";

export default function Tesseract() {
  const [ocrProgress, setOcrProgress] = useState(null);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const w = 400;
  const h = 300;

  const { capture } = useCamera({ videoRef, canvasRef });

  const { worker, loaded } = useTesseract(
    ({ workerId, jobId, status, progress }) => {
      // Uncomment to debug
      // console.log("[DEBUG] tesseract.js:", status, progress);
      if (status === "recognizing text") {
        setOcrProgress(progress < 1 ? progress : null);
      }
    }
  );

  async function recognizeImage() {
    console.log("recognizing image..");
    const image = capture();

    try {
      const {
        data: { text }
      } = await worker.recognize(image);
      console.log("text:", text);
    } catch (e) {
      console.log("error");
      setError(e);
    }
  }

  return (
    <div>
      <img
        src={"/assets/images/tesseract_payload_eng_bw.png"}
        alt="tesseract payload"
      />
      <div>Tesseract</div>
      {loaded ? (
        <button onClick={recognizeImage}>Recognize</button>
      ) : (
        "Loading tesseract.."
      )}

      {ocrProgress !== null && (
        <div>OCR Progress: {(ocrProgress * 100).toFixed(0)}%</div>
      )}

      {error !== null && <div>error: {error}</div>}

      <div>
        <video autoPlay playsInline muted ref={videoRef} width={w} height={h} />
        <canvas
          ref={canvasRef}
          width={w}
          height={h}
          style={{ display: "none" }}
        />
      </div>
      <button onClick={recognizeImage}>Capture</button>
    </div>
  );
}
