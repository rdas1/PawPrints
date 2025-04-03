import Lottie from "lottie-react";
import dogRunning from "@/assets/dog_running.json";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Lottie
        animationData={dogRunning}
        loop
        className="w-40 h-40 scale-x-[-1]"
      />
      <p className="mt-4 text-lg font-medium font-display text-white">Fetching data...</p>
    </div>
  );
}
