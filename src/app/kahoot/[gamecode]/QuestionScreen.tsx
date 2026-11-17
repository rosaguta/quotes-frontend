"use client"
import { Card } from "@/components/ui/card"
import DarkCard from "@/components/ui/DarkCard"
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { mediaUrl } from "@/utils/socket";

interface QuestionScreenProps {
  onGotoLobby: () => void
  submitAnswer: (answer: string) => void
  possibleAnswers: string[]
  question: string
  image?: string | null // shown instead of the question text when set
  fillerText: string
  introDelayMs: number // time before the countdown starts
  timeLimitMs: number // time to answer once the countdown runs
  round: number
  totalRounds: number
}

export default function QuestionScreen({ onGotoLobby, submitAnswer, possibleAnswers, question, image, fillerText, introDelayMs, timeLimitMs, round, totalRounds }: QuestionScreenProps) {
  const countdownRef = useRef<HTMLSpanElement>(null)
  const answeredRef = useRef(false)
  const onGotoLobbyRef = useRef(onGotoLobby)
  onGotoLobbyRef.current = onGotoLobby

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
      duration: Math.min(2000, introDelayMs || 500),
    });
    animate('.quote-text', {
      opacity: [0, 1],
      duration: 1500,
      delay: Math.min(500, introDelayMs),
      ease: 'easeOutExpo',
    });
    animate('.answer-card', {
      scale: [0.8, 1],
      opacity: [0, 1],
      rotate: [10, 0],
      duration: 1000,
      delay: stagger(200, { start: Math.min(1000, introDelayMs) }),
      ease: 'easeOutSine',
    });

    animate('.progress-bar', {
      opacity: [0, 1],
      scaleY: [0, 1],
      duration: 800,
      delay: Math.max(0, introDelayMs - 500),
      ease: 'easeOutExpo',
    });

    animate('.progress-fill', {
      width: ['100%', '0%'],
      duration: timeLimitMs,
      delay: introDelayMs,
      ease: 'linear',
    });
    animate('.progress-fill', {
      backgroundColor: ['#35BDF2', '#F27EBE'],
      duration: timeLimitMs,
      delay: introDelayMs,
      ease: 'outQuad',
    });

    animate('.progress-container', {
      scale: [1, 0.98, 1],
      duration: 500,
      delay: introDelayMs + Math.max(0, timeLimitMs - 3000),
      loop: 6,
      ease: 'easeInOutSine',
    });
  }, [introDelayMs, timeLimitMs]);

  useEffect(() => {
    const countdownStart = Date.now() + introDelayMs
    const deadline = countdownStart + timeLimitMs
    const render = () => {
      const remaining = Math.max(0, deadline - Math.max(Date.now(), countdownStart))
      if (countdownRef.current) {
        countdownRef.current.textContent = String(Math.ceil(remaining / 1000))
      }
      return remaining
    }
    render()
    const interval = setInterval(() => {
      if (render() <= 0) {
        clearInterval(interval)
        if (!answeredRef.current) onGotoLobbyRef.current()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [introDelayMs, timeLimitMs]);

  const handleAnswerClick = (answer: string) => {
    if (answeredRef.current) return
    answeredRef.current = true
    submitAnswer(answer)
    onGotoLobby()
  }

  const answerColors = ["#F27EBE", "#35BDF2", "#F2E74B", "#4CAF50"]

  return (
    <div className="flex justify-center ">
      <div className="w-full md:w-1/3 h-dvh p-2 flex flex-col">
        {/* Progress bar */}
        <div className="w-full mb-4 progress-bar opacity-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-terminal text-zinc-400">Round {round}/{totalRounds} · Time remaining</span>
            <span ref={countdownRef} className="text-lg font-terminal font-bold text-white">{Math.ceil(timeLimitMs / 1000)}</span>
          </div>
          <div className="progress-container relative h-3 bg-b rounded-full border border-zinc-800 overflow-hidden">
            <div className="progress-fill absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all duration-100"></div>
          </div>
        </div>

        {/* Main card */}
        <div className="flex justify-center w-full text-xl pb-2 ">
          {image ? (
            <Card className="p-2 flex flex-col items-center gap-2 w-full font-terminal main-card opacity-0">
              <p className="text-zinc-400 quote-text">{question}</p>
              {/* Media intentionally hidden on the phone:
              <img src={mediaUrl(image)} alt="Quote" className="quote-text max-h-[40dvh] w-full object-contain rounded-md" /> */}
            </Card>
          ) : (
            <Card className="px-4 flex flex-col justify-evenly items-center h-60 w-full font-terminal main-card opacity-0">
              <p className="text-zinc-400 quote-text">{fillerText}</p>
              <p className="h-32 quote-text">{question}</p>
            </Card>
          )}
        </div>

        {/* Grid answers → take up remaining space */}
        <div className="grid flex-grow gap-2 grid-cols-2 place-items-center font-terminal">
          {possibleAnswers.map((answer, i) => {
            const color = answerColors[i % answerColors.length]
            return (
              <DarkCard
                key={answer}
                onClick={() => handleAnswerClick(answer)}
                className="w-full h-full flex justify-center items-center answer-card opacity-0 cursor-pointer select-none"
                style={{ borderColor: `${color}cc` }}
                color={color}
              >
                {answer}
              </DarkCard>
            )
          })}
        </div>
      </div>
    </div>
  )


}