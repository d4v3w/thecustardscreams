"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import st from "./ClientDialog.module.css";

interface ClientDialogProps {
  initialState: boolean;
}

const ClientDialog = ({ initialState }: ClientDialogProps) => {
  const [showOverlay, setShowOverlay] = useState(initialState);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const closeDialog = () => {
    setShowOverlay(false);
    // close native dialog immediately when requested
    if (dialogRef?.current?.open) dialogRef.current.close();
  };

  useEffect(() => {
    const videoEl = document.createElement("video");
    const supportsWebM = videoEl.canPlayType("video/webm") !== "";
    const supportsMP4 = videoEl.canPlayType("video/mp4") !== "";

    if (!supportsWebM && !supportsMP4) {
      setShowOverlay(false);
      return;
    }

    if (showOverlay) {
      // open the native dialog when state turns true
      if (dialogRef?.current && !dialogRef?.current.open)
        dialogRef.current.showModal();
    } else {
      // close the native dialog when state turns false
      if (dialogRef?.current?.open) {
        dialogRef.current.close();
      }
    }

    // Escape key handler to close
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDialog();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showOverlay]);

  const handleVideoError = () => closeDialog();

  return (
    <dialog
      // only close when clicking the backdrop (target is the dialog itself)
      onClick={(e: MouseEvent<HTMLDialogElement>) => {
        if (e.target === dialogRef.current) {
          closeDialog();
        }
      }}
      ref={dialogRef}
      className={st.dialog}
    >
      <video
        autoPlay
        controls
        className="aspect-[9/16] h-screen object-cover"
        onError={handleVideoError}
        onEnded={closeDialog}
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

export default ClientDialog;
