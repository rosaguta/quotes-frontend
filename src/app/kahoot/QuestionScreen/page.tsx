"use client"
import { Card } from "@/components/ui/card"
import DarkCard from "@/components/ui/DarkCard"
import { GetColorWithOpacity } from "@/utils/Color"
import { useEffect, useRef, useState } from "react";
import { animate, createTimer, stagger, utils } from "animejs";

export default function QuestionScreen() {
    const countdownRef = useRef()
    useEffect(() => {
        animate('.main-card', {
            borderColor: ['#F27EBE', '#35BDF2', '#F2E74B', '#4CAF50', '#F27EBE'],
            duration: 5000,
            ease: 'easeInOutQuad',
            direction: 'alternate',
            loop: true,
        });
        animate('.quote-text', {
            opacity: [0, 1],
            duration: 1500,
            delay: 500,
            ease: 'easeOutExpo',
        });
        animate('.answer-card', {
            scale: [0.8, 1],
            opacity: [0, 1],
            rotate: [10, 0],
            duration: 1000,
            delay: stagger(200, { start: 1000 }),
            ease: 'easeOutSine',
        });

        // Progress bar animations
        animate('.progress-bar', {
            opacity: [0, 1],
            scaleY: [0, 1],
            duration: 800,
            delay: 2000,
            ease: 'easeOutExpo',
        });

        // Progress fill animation (10 seconds countdown)
        animate('.progress-fill', {
            width: ['100%', '0%'],
            duration: 10000,
            delay: 2500,
            ease: 'linear',
        });

        // Color transition from green to red
        animate('.progress-fill', {
            backgroundColor: ['#35BDF2', '#F27EBE'],
            duration: 10000,
            delay: 2500,
            ease: 'outQuad',
        });


        // Progress bar pulse effect when time is running out
        animate('.progress-container', {
            scale: [1, 0.98, 1],
            duration: 500,
            delay: 9000,
            loop: 6,
            ease: 'easeInOutSine',
        });

    }, []);
    // Countdown timer logic
    let currentCountdown = 10;
    createTimer({
        delay: 2000,
        duration: 1000,
        loop: 10, // Loop 10 times for a 10-second countdown
        reversed: true,
        onLoop: self => {
            const newCountdown = currentCountdown - 1;
            if (countdownRef.current) {
                countdownRef.current.innerHTML = newCountdown;
            }
            currentCountdown = newCountdown;
        }

    });
    return (
  <div className="w-full h-dvh p-2 flex flex-col">
    {/* Progress bar */}
    <div className="w-full mb-4 progress-bar opacity-0">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-terminal text-zinc-400">Time remaining</span>
        <span ref={countdownRef} className="text-lg font-terminal font-bold text-white">10</span>
      </div>
      <div className="progress-container relative h-3 bg-b rounded-full border border-zinc-800 overflow-hidden">
        <div className="progress-fill absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all duration-100"></div>
      </div>
    </div>

    {/* Main card */}
    <div className="flex justify-center w-full text-xl pb-2">
      <Card className="px-4 flex flex-col justify-evenly items-center h-60 w-full font-terminal main-card">
        <p className="text-zinc-400 quote-text">No way _____ said this:</p>
        <p className="h-32 quote-text">Live in my walls? how about u live in my balls</p>
      </Card>
    </div>

    {/* Grid answers → take up remaining space */}
    <div className="grid flex-grow gap-2 grid-cols-2 place-items-center font-terminal">
      <DarkCard className="w-full h-full flex justify-center items-center border-[#F27EBE]/80 answer-card" direction="to_bottom_right" color="#F27EBE">Rose</DarkCard>
      <DarkCard className="w-full h-full flex justify-center items-center border-[#35BDF2]/80 answer-card" direction="to_bottom_left" color="#35BDF2">Liv</DarkCard>
      <DarkCard className="w-full h-full flex justify-center items-center border-[#F2E74B]/80 answer-card" direction="to_top_right" color="#F2E74B">Daan</DarkCard>
      <DarkCard className="w-full h-full flex justify-center items-center border-[#4CAF50]/80 answer-card" direction="to_top_left" color="#4CAF50">Vika</DarkCard>
    </div>
  </div>
)

    
}