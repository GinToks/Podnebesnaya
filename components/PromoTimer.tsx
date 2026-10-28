"use client";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface PromoTimerProps {
  endDate: string | Date;
  label?: string;
  className?: string;
}

export default function PromoTimer({ endDate, label, className = "" }: PromoTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const target = new Date(endDate).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setExpired(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (expired) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {label && <span className="text-xs font-medium text-ink-muted">{label}</span>}
      <div className="flex items-center gap-1">
        <Clock size={14} className="text-accent" />
        <span className="font-mono text-sm font-bold text-accent">
          {timeLeft.days > 0 && `${timeLeft.days}д `}
          {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </span>
      </div>
    </div>
  );
}