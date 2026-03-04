"use client"
import { Card } from "@/components/ui/card"
import DarkCard from "@/components/ui/DarkCard"
import { GetColorWithOpacity } from "@/utils/Color"
import { useEffect, useRef, useState } from "react";
import { animate, createTimer, stagger, utils } from "animejs";
import { Socket } from "socket.io-client";

interface Answer {
  answer: string
  timeTaken: number
}

interface QuestionScreenProps {
  onGotoLobby: () => void
  submitAnswer: (Answer) => void
  possibleAnswers : string[]
  question: string
  fillerText: string
}

export default function QuestionScreen({ onGotoLobby, submitAnswer, possibleAnswers, question, fillerText }: QuestionScreenProps) {
  const countdownRef = useRef()
  const [timeTaken, setTimeTaken] = useState(0)
  useEffect(() => {
    animate('.main-card', {
      borderColor: ['#F27EBE', '#35BDF2', '#F2E74B', '#4CAF50', '#F27EBE'],
      duration: 5000,
      ease: 'easeInOutQuad',
      direction: 'alternate',
      loop: true,
    });
    animate('.main-card', {
      opacity: [0, 1],
      duration: 2000,
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

    // Color transition from blue to pink
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
  useEffect(() => {
    let currentCountdown = 10;

    const timer = createTimer({
      delay: 2500,
      duration: 1000,
      loop: 10,
      reversed: true,
      onLoop: () => {
        const newCountdown = currentCountdown - 1;
        setTimeTaken((prev) => prev + 1);

        if (countdownRef.current) {
          countdownRef.current.innerHTML = String(newCountdown);
        }
        currentCountdown = newCountdown;

        if (newCountdown <= 0) {
          const maxTime = 10
          // socket.emit("playerAnswer", { answer: "", timeTaken: maxTime })
          submitAnswer({ answer: "", timeTaken: timeTaken })
          // onGotoLobby();
        }
      },
    });

    return () => {
      timer.pause?.();
    };
  }, [onGotoLobby]);

  const handleAnwerClick = (answer: string) => {
    // socket.emit("playerAnswer", { answer: answer, timeTaken: timeTaken })
    console.log({ answer: answer, timeTaken: timeTaken })
    submitAnswer({ answer: answer, timeTaken: timeTaken })
    onGotoLobby()
  }
  
  return (
    <div className="flex justify-center ">
      <div className="w-full md:w-1/3 h-dvh p-2 flex flex-col">
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
        <div className="flex justify-center w-full text-xl pb-2 ">
          <Card className="px-4 flex flex-col justify-evenly items-center h-60 w-full font-terminal main-card opacity-0">
            <p className="text-zinc-400 quote-text">{fillerText}</p>
            <p className="h-32 quote-text">{question}</p>
          </Card>
        </div>

        {/* Grid answers → take up remaining space */}
        <div className="grid flex-grow gap-2 grid-cols-2 place-items-center font-terminal">
          <DarkCard onClick={() => { handleAnwerClick(possibleAnswers [0]) }} className="w-full h-full flex justify-center items-center border-[#F27EBE]/80 answer-card opacity-0" direction="to_bottom_right" color="#F27EBE">{possibleAnswers [0]}</DarkCard>
          <DarkCard onClick={() => { handleAnwerClick(possibleAnswers [1]) }} className="w-full h-full flex justify-center items-center border-[#35BDF2]/80 answer-card opacity-0" direction="to_bottom_left" color="#35BDF2">{possibleAnswers [1]}</DarkCard>
          <DarkCard onClick={() => { handleAnwerClick(possibleAnswers [2]) }} className="w-full h-full flex justify-center items-center border-[#F2E74B]/80 answer-card opacity-0" direction="to_top_right" color="#F2E74B">{possibleAnswers [2]}</DarkCard>
          <DarkCard onClick={() => { handleAnwerClick(possibleAnswers [3]) }} className="w-full h-full flex justify-center items-center border-[#4CAF50]/80 answer-card opacity-0" direction="to_top_left" color="#4CAF50">{possibleAnswers [3]}</DarkCard>
        </div>
      </div>
    </div>
  )


}