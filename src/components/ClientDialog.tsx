"use client";

import { useEffect, useRef, useState } from "react";

interface ClientDialogProps {
  initialState: boolean;
}

const ClientDialog = ({ initialState }: ClientDialogProps) => {
  const [showOverlay, setShowOverlay] = useState(initialState);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const videoEl = document.createElement("video");
    const supportsWebM = videoEl.canPlayType("video/webm") !== "";
    const supportsMP4 = videoEl.canPlayType("video/mp4") !== "";

    if (!supportsWebM && !supportsMP4) {
      setShowOverlay(false);
    }

    if (showOverlay && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, [showOverlay]);

  const closeDialog = () => dialogRef.current?.close();
  const handleVideoError = () => setShowOverlay(false);

  return (
    <dialog
      onClick={closeDialog}
      open={showOverlay}
      className="flex flex-col items-center"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      }}
      ref={dialogRef}
    >
      <video
        autoPlay
        loop
        controls
        className="aspect-[9/16] h-screen object-cover"
        onError={handleVideoError}
      >
        <source
          src="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1VmoiNTAuIT0qi4yXtg9SldF37jxKBDaPcHZr"
          type="video/webm"
        />
        <source
          src="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1vCABEku14NJBxIZe9ydb5S7Ko2ADc3qwMT0G"
          type="video/mp4"
        />
        <p>Your browser does not support the video tag.</p>
      </video>
    </dialog>
  );
};

ClientDialog.displayName = "ClientDialog";
export default ClientDialog;
