import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";

export default function useTesseract(logger, language = "eng") {
  const [loaded, setLoaded] = useState(false);

  const worker = createWorker({
    logger
  });

  useEffect(() => {
    // Init tesseract worker
    (async () => {
      await worker.load();
      await worker.loadLanguage(language);
      await worker.initialize(language);

      setLoaded(true);
    })();
  });

  return { worker, loaded };
}
