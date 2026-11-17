"use client"
import { useEffect, useState } from "react";

type Star = {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
};


export default function FloatingStars({ count }: { count: number }) {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only random values must be set after mount
    setStars(
      Array.from({ length: count }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${5 + Math.random() * 5}s`,
      }))
    );
  }, [count]);

  return (
    <div className="fixed inset-0 opacity-30 -z-20">
      {stars.map((style, i) => (
        <div
          key={i}
          className="absolute w-[4px] h-[4px] bg-white rounded-full animate-float"
          style={style}
        />
      ))}
    </div>
  );
}
