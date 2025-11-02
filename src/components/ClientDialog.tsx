"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import st from "./ClientDialog.module.css";

interface ClientDialogProps {
  initialState: boolean;
}

const ClientDialog = ({ initialState }: ClientDialogProps) => {
  const [showOverlay, setShowOverlay] = useState(initialState);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    console.log("opening");
    setShowOverlay(true);
    // ensure native dialog opens immediately if available
    if (dialogRef.current && !dialogRef.current.open)
      dialogRef.current.showModal();
  };
  const closeDialog = () => {
    console.log("closing");
    setShowOverlay(false);
    // close native dialog immediately when requested
    if (dialogRef.current && dialogRef.current.open) dialogRef.current.close();
  };

  useEffect(() => {
    console.log("useEffect");
    const videoEl = document.createElement("video");
    const supportsWebM = videoEl.canPlayType("video/webm") !== "";
    const supportsMP4 = videoEl.canPlayType("video/mp4") !== "";

    if (!supportsWebM && !supportsMP4) {
      setShowOverlay(false);
      return;
    }

    if (showOverlay) {
      // open the native dialog when state turns true
      if (dialogRef.current && !dialogRef.current.open) {
        console.log("useEffect: showModal");
        dialogRef.current.showModal();
      }
    } else {
      // close the native dialog when state turns false
      if (dialogRef.current && dialogRef.current.open) {
        console.log("useEffect: close native dialog");
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
          console.log("backdrop clicked");
          closeDialog();
        }
      }}
      ref={dialogRef}
      className={st.dialog}
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
        <p>Your browser does not support the video tag.</p>
      </video>
    </dialog>
  );
};

ClientDialog.displayName = "ClientDialog";
export default ClientDialog;
