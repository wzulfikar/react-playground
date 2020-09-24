import { useEffect, useState } from "react";

const streamer = (image, facingMode) =>
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        facingMode
      }
    })
    .then((stream) => {
      image.srcObject = stream;
      return new Promise((resolve, reject) => {
        image.onloadedmetadata = () => {
          resolve();
        };
      });
    });

const pipeline = async (canvas, handler) => {
  const processFrame = async (canvas, image) => {
    handler(canvas, image);

    window.requestAnimationFrame(() => {
      processFrame(canvas, image);
    });
  };
  return processFrame;
};

export default function useCamera({
  videoRef,
  canvasRef = null,
  onFrame = (canvas, image) => {},
  facingMode = "user"
}) {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("error: could not get access to device camera");
      return;
    }

    const webcamPromise = streamer(videoRef.current, facingMode);
    const processFramePromise = pipeline(canvasRef?.current, onFrame);

    Promise.all([webcamPromise, processFramePromise])
      .then(([webcam, processFrame]) => {
        processFrame(canvasRef?.current, videoRef.current);
        // setIsLoading(false);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        // setIsLoading(false);
      });
  }, [videoRef, canvasRef, onFrame, facingMode]);

  window.vid = videoRef.current;

  return {
    capture: () => {
      if (!canvasRef.current) {
        console.warn(
          "[WARN] `capture` will always return null when `canvasRef` is null"
        );
        return null;
      }

      const canvas = canvasRef.current;
      canvas
        .getContext("2d")
        .drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      return canvas.toDataURL();
    },
    error
  };
}
