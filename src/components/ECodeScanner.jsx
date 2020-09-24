import React, { useState, useRef } from "react";
import { AiOutlineClose, AiFillCamera, AiOutlineReload } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";

import useFirebaseConfig from "../hooks/useFirebaseConfig";
import useGoogleVision from "../hooks/useGoogleVision";
import useCamera from "../hooks/useCamera";
import ActionSheet from "./ActionSheet";

const reECode = /(E|e)\d{3}/g;

export default function ECodeScanner() {
  const apiKey = useFirebaseConfig("google_vision_api_key.key");

  const [openScanner, setOpenScanner] = useState(false);
  const [previewing, setPreviewing] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eCodes, setECodes] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const w = 600;
  const h = 600;

  const { capture } = useCamera({
    videoRef,
    canvasRef,
    facingMode: "environment"
  });

  const { annotateImage } = useGoogleVision(apiKey);

  function retake() {
    setPreviewing(null);
  }

  async function scanImage() {
    console.log("recognizing image..");
    const image = capture();

    setError(null);
    setLoading(true);
    setECodes("");
    setPreviewing(image);

    try {
      const { annotations, error } = await annotateImage(image);

      if (error) {
        setError(error.message);
      } else {
        const _annotation = annotations
          ? annotations.map(({ description }) => description).join(" ")
          : "";

        const matchECodes = _annotation.match(reECode);
        if (matchECodes) {
          setECodes(Array.from(new Set(matchECodes)).join(" "));
        } else {
          setECodes("");
        }
      }
    } catch (e) {
      console.log("error:", error);
      setError(e.message);
    }

    setLoading(false);
  }

  return (
    <div className="bg-gray-200 h-screen overflow-hidden">
      <style>{`
      .sheet > div {
        height: 60px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
      }`}</style>

      <div className="text-xl text-center py-4">E-Code Scanner</div>

      <div className="flex flex-col items-center justify-center mt-10">
        <input
          className="my-5 border border-gray-400 px-2"
          placeholder={"Insert e-code or scan"}
          onChange={(e) => setECodes(e.target.value)}
          value={eCodes}
        />
        <button
          className="text-lg rounded-sm bg-gray-300 px-2 border border-gray-400"
          onClick={() => setOpenScanner(true)}
        >
          Open Scanner
        </button>

        <ActionSheet
          className="sheet"
          height={440}
          open={openScanner}
          onClose={() => {
            setOpenScanner(false);
          }}
        >
          <div className="flex-col" style={{ height: 300, marginTop: 15 }}>
            <div
              className="flex justify-center items-center rounded-md shadow-md bg-gray-700"
              style={{
                height: 250,
                width: 250,
                overflow: "hidden"
              }}
            >
              <video
                ref={videoRef}
                muted
                autoPlay
                playsInline
                width={w}
                height={h}
                style={{
                  maxWidth: "initial",
                  display: previewing ? "none" : "block"
                }}
              />
              <canvas
                ref={canvasRef}
                width={w}
                height={h}
                style={{
                  maxWidth: "initial",
                  display: previewing ? "block" : "none"
                }}
              />
            </div>

            <div className="flex items-center justify-center h-10 text-gray-700">
              {loading && <div>Processing image..</div>}
              {!loading && previewing && (
                <div>{eCodes || "No e-code detected"}</div>
              )}
              {error !== null && <div>error: {error}</div>}
            </div>
          </div>

          <div>
            {previewing ? (
              <button
                className="flex justify-center items-center font-medium w-full h-16"
                onClick={retake}
              >
                {loading ? (
                  <CgSpinner size={20} className="animate animate-spin" />
                ) : (
                  <>
                    <AiOutlineReload size={16} className="mr-1" /> Retake{" "}
                  </>
                )}
              </button>
            ) : (
              <button
                className="flex justify-center items-center font-medium w-full h-16"
                onClick={scanImage}
              >
                <AiFillCamera size={16} className="mr-1" />
                Scan E-Code
              </button>
            )}
          </div>

          <div>
            <button
              className="flex justify-center items-center font-medium w-full h-16 opacity-75"
              onClick={() => setOpenScanner(false)}
            >
              <AiOutlineClose size={16} className="mr-1" /> Close
            </button>
          </div>
        </ActionSheet>
      </div>
    </div>
  );
}
