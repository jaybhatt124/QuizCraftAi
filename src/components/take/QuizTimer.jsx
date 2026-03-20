import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function QuizTimer({ timeLimit, onTimeUp }) {
  const [remainingTime, setRemainingTime] = useState(timeLimit * 60);

  useEffect(() => {
    if (remainingTime <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime, onTimeUp]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  
  const timeColor = remainingTime < 60 ? "text-red-500" : "text-gray-700";

  return (
    <div className={`flex items-center gap-2 font-semibold ${timeColor}`}>
      <Clock className="w-5 h-5" />
      <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    </div>
  );
}