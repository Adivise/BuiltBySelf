"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

export function useQrCanvas(show: boolean, url: string, size: number) {
  const [qrCanvas, setQrCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!show || !url.trim()) {
      setQrCanvas(null);
      return;
    }
    const canvas = document.createElement("canvas");
    QRCode.toCanvas(canvas, url, {
      width: size * 4,
      margin: 1,
      errorCorrectionLevel: "M",
    })
      .then(() => setQrCanvas(canvas))
      .catch(() => setQrCanvas(null));
  }, [show, url, size]);

  return qrCanvas;
}
