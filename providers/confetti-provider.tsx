"use client";

import { useConfetti } from "@/hooks/use-confetti";
import ReactConfetti from "react-confetti";

function ConfettiProvider() {
  const confetti = useConfetti();

  if (!confetti.isOpen) return null;

  return (
    <ReactConfetti
      className="pointer-events-none z-[100]"
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={() => confetti.onClose()}
    />
  );
}

export default ConfettiProvider;
