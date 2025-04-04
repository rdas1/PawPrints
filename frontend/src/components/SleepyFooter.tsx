import Lottie from "lottie-react";
import sleepingCat from "@/assets/sleeping_cat.json";

export default function SleepyFooter() {
  return (
    <div className="w-full flex justify-center items-end gap-12 pb-2">
      <Lottie animationData={sleepingCat} loop={true} className="w-28 h-28" />
    </div>
    
  );
}
