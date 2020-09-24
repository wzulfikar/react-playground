import React, { useState, useRef } from "react";

import useFirebaseConfig from "../hooks/useFirebaseConfig";
import useGoogleVision from "../hooks/useGoogleVision";
import useCamera from "../hooks/useCamera";

export default function Tesseract() {
  const apiKey = useFirebaseConfig("google_vision_api_key.key");

  const [loading, setLoading] = useState(false);
  const [annotation, setAnnotation] = useState(null);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const w = 400;
  const h = 300;

  const { capture } = useCamera({
    videoRef,
    canvasRef,
    facingMode: "environment"
  });

  const { annotateImage } = useGoogleVision(apiKey);

  async function recognizeImage() {
    console.log("recognizing image..");
    const image = capture();

    setAnnotation(null);
    setLoading(true);
    setError(null);

    try {
      const { annotations, error } = await annotateImage(image);

      if (error) {
        setError(error.message);
      } else {
        const _annotation =
          annotations &&
          annotations.map(({ description }) => description).join(" ");
        setAnnotation(_annotation || "(No text detected)");
      }
    } catch (e) {
      console.log("error:", error);
      setError(e.message);
    }

    setLoading(false);
  }

  return (
    <div>
      <div className="text-xl text-center mb-4">Google Vision</div>

      <div className="flex flex-col items-center justify-center space-y-5">
        <video autoPlay playsInline muted ref={videoRef} width={w} height={h} />
        <canvas
          ref={canvasRef}
          width={w}
          height={h}
          style={{ display: "none" }}
        />
        <button
          className="rounded-sm bg-gray-300 px-2 border border-gray-400"
          onClick={recognizeImage}
        >
          Annotate
        </button>

        <div>{loading ? "loading.." : annotation}</div>
        {error !== null && <div>error: {error}</div>}
      </div>
    </div>
  );
}
