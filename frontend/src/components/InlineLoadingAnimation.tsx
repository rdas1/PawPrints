// src/components/InlineLoadingAnimation.tsx
import Lottie from "lottie-react";
import dogRunning from "@/assets/dog_running.json"; // Adjust path if needed

export default function InlineLoadingAnimation() {
  return (
    <div className="flex justify-center items-center py-4">
      <Lottie
        animationData={dogRunning}
        loop
        style={{ height: 80, transform: "scaleX(-1)" }} // flipped to face right
      />
      <p className="ml-3 text-white font-display">Loading...</p>
    </div>
  );
}
