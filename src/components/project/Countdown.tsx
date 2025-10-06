'use client';

import { useEffect, useState } from "react"


export default function Countdown(){
    const eventDate = new Date("2025-10-20T00:00:00")
    const [timeLeft, setTimeLeft] = useState({days:0, hours:0, minutes:0, seconds:0})

    useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = eventDate.getTime() - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center text-2xl font-bold mt-6">
      <p>Faltam</p>
      <div className="flex justify-center gap-4 mt-2">
        <div className="flex flex-col items-center">
          <span className="text-4xl text-primary">{timeLeft.days}</span>
          <span className="text-sm text-muted-foreground">dias</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl text-primary">{timeLeft.hours}</span>
          <span className="text-sm text-muted-foreground">horas</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl text-primary">{timeLeft.minutes}</span>
          <span className="text-sm text-muted-foreground">min</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl text-primary">{timeLeft.seconds}</span>
          <span className="text-sm text-muted-foreground">seg</span>
        </div>
      </div>
    </div>
  );
}