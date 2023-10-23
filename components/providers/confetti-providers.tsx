"use client";

import ReactConfetti from "react-confetti";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface ConfettiProviderProps {}
const ConfettiProvider: React.FC<ConfettiProviderProps> = ({}) => {
  const confetti = useConfettiStore();

  if (!confetti.isOpen) {
    return null;
  }
  return (
    <ReactConfetti
      className="pointer-events-none a-[100]"
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={() => {
        confetti.onClose();
      }}
    />
  );
};
export default ConfettiProvider;
