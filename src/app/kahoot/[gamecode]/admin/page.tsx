"use client"
import { socket } from '@/utils/socket'
import { useState, useEffect } from 'react'
import { useParams } from "next/navigation";
import DarkCard from '@/components/ui/DarkCard';
import { LeaderboardEntry, Player } from '@/types/player';
import { animate, stagger } from 'animejs';
import { mediaUrl } from '@/utils/socket';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Phase = "lobby" | "question" | "results" | "finished";

interface GeneratedQuestion {
  Category: string;
  Question: string;
  Answer: string;
  InCorrectAnswers: string[];
  Image?: string;
  Audio?: string;
}

interface GameSettings {
  TimePerQuestion: number;
  ImageQuestions: number;
  AudioQuestions: number;
}

const settingFields: { key: keyof GameSettings; label: string; min: number; max: number }[] = [
  { key: "TimePerQuestion", label: "Seconds / question", min: 5, max: 120 },
  { key: "ImageQuestions", label: "Image questions", min: 0, max: 50 },
  { key: "AudioQuestions", label: "Audio questions", min: 0, max: 50 },
]

interface AdminState {
  phase: Phase;
  round: number;
  totalRounds: number;
  settings: GameSettings;
  question: {
    Category: string;
    Question: string;
    Answer: string;
    Answers: string[];
    Image: string | null;
    Audio: string | null;
  } | null;
  answeredCount: number;
  playerCount: number;
  remainingMs: number;
  leaderboard: LeaderboardEntry[];
}

export default function AdminPanel() {
  const params = useParams();
  const { gamecode } = params
  const [players, setPlayers] = useState<Player[]>([])
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [state, setState] = useState<AdminState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [settings, setSettings] = useState<Record<keyof GameSettings, string>>({
    TimePerQuestion: "10", ImageQuestions: "5", AudioQuestions: "5",
  })
  const [customFiles, setCustomFiles] = useState<{ images: number, audio: number } | null>(null)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    // Animate all player cards on join/change
    animate('.player-card', {
      translateY: [20, 0],
      opacity: [0, 1],
      delay: stagger(100),
      duration: 500,
      easing: 'easeOutExpo'
    });
  }, [players.length]);

  useEffect(() => {
    function register() {
      socket.emit('registerAdmin', { gamecode })
    }
    function onAdminRegistered(code: string) {
      console.log(`[admin] connected to ${code}`)
    }
    function onPlayersChange(players: Player[]) {
      setPlayers(players);
    }
    function onRandomizedGame(game: GeneratedQuestion[]) {
      setQuestions(game)
      setGenerating(false)
      setError(null)
    }
    function onAdminState(s: AdminState) {
      setState(s)
      setRemaining(s.remainingMs)
    }
    function onGameSettings(s: GameSettings) {
      setSettings({
        TimePerQuestion: String(s.TimePerQuestion),
        ImageQuestions: String(s.ImageQuestions),
        AudioQuestions: String(s.AudioQuestions),
      })
    }
    function onCustomFiles(counts: { images: number, audio: number }) {
      setCustomFiles(counts)
    }
    function onAdminError(message: string) {
      setError(message)
      setGenerating(false)
    }

    socket.on('connect', register)
    socket.on('adminRegistered', onAdminRegistered)
    socket.on('adminPlayerUpdate', onPlayersChange)
    socket.on('RandomizedGame', onRandomizedGame)
    socket.on('adminState', onAdminState)
    socket.on('GameSettings', onGameSettings)
    socket.on('adminError', onAdminError)
    socket.on('customFiles', onCustomFiles)

    if (socket.connected) register()
    else socket.connect()

    return () => {
      socket.off('connect', register)
      socket.off('adminRegistered', onAdminRegistered)
      socket.off('adminPlayerUpdate', onPlayersChange)
      socket.off('RandomizedGame', onRandomizedGame)
      socket.off('adminState', onAdminState)
      socket.off('GameSettings', onGameSettings)
      socket.off('adminError', onAdminError)
      socket.off('customFiles', onCustomFiles)
    };
  }, [gamecode]);

  // local countdown between server updates
  useEffect(() => {
    if (state?.phase !== 'question') return
    const deadline = Date.now() + state.remainingMs
    const interval = setInterval(() => setRemaining(Math.max(0, deadline - Date.now())), 250)
    return () => clearInterval(interval)
  }, [state])

  function handlePrepRandomGame() {
    setGenerating(true)
    setError(null)
    socket.emit('RandomPrepGame')
  }
  function nextRound() {
    setError(null)
    socket.emit("NextRound")
  }
  function endRound() {
    socket.emit("EndRound")
  }
  function endGame() {
    socket.emit("EndGame")
  }
  function saveSettings() {
    socket.emit("setGameSettings", settings)
  }

  // join link for the QR code; built after mount since it needs window.location
  const [joinUrl, setJoinUrl] = useState("")
  useEffect(() => {
    setJoinUrl(`${window.location.origin}/kahoot?code=${encodeURIComponent(String(gamecode))}`)
  }, [gamecode])

  const phase = state?.phase ?? "lobby"
  const hasGame = questions.length > 0
  const isLastRound = !!state && state.round >= state.totalRounds
  const nextLabel =
    phase === "lobby" ? "Start game" :
    phase === "results" && isLastRound ? "Show final results" :
    "Next question"
  const scoreboard = state?.leaderboard ?? players

  return (
    <div className="flex flex-col w-screen min-h-screen items-center pb-10">
      <div className="flex justify-center pt-6">
        <h1 id="HOSTMSG" className="font-terminal font-bold text-xs md:text-lg">HOST VIEW · {gamecode}</h1>
      </div>

      {/* Join QR: big before the game starts, small once it's running (for late joiners) */}
      <div className="flex flex-col items-center mt-4 font-terminal">
        {joinUrl && (
          <a href={joinUrl} target="_blank" rel="noreferrer" className="bg-white p-3 rounded-xl" title={joinUrl}>
            <QRCodeSVG value={joinUrl} size={phase === "lobby" ? 240 : 96} marginSize={0} />
          </a>
        )}
        {phase === "lobby" ? (
          <>
            <p className="text-white text-lg mt-3">Scan to join</p>
            <p className="text-zinc-400 text-sm">or go to {joinUrl.replace(/\?.*$/, "")} and enter code <span className="text-white font-bold">{gamecode}</span></p>
          </>
        ) : (
          <p className="text-zinc-500 text-xs mt-1">Code: {gamecode}</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center items-end gap-2 mt-4 px-4 font-terminal">
        <Button onClick={handlePrepRandomGame} disabled={generating || phase === "question"}>
          {generating ? "Generating..." : hasGame ? "New game" : "Generate game"}
        </Button>
        <Button onClick={nextRound} disabled={!hasGame || phase === "question" || phase === "finished"}>
          {nextLabel}
        </Button>
        {phase === "question" && <Button variant="outline" onClick={endRound}>End round now</Button>}
        {hasGame && phase !== "lobby" && phase !== "finished" && (
          <Button variant="outline" onClick={endGame}>End game</Button>
        )}
        <div className="flex flex-wrap items-end gap-2 ml-2">
          {settingFields.map(({ key, label, min, max }) => (
            <div key={key}>
              <Label htmlFor={key} className="text-xs text-zinc-400">{label}</Label>
              <Input id={key} type="number" min={min} max={max} className="w-24"
                value={settings[key]}
                onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))} />
            </div>
          ))}
          <Button variant="outline" onClick={saveSettings} disabled={phase === "question"}>Save</Button>
        </div>
      </div>
      {customFiles && (
        <p className="text-zinc-500 font-terminal text-xs mt-2">
          Available: {customFiles.images} images · {customFiles.audio} audio clips (image/audio counts apply on the next generate)
        </p>
      )}
      {error && <p className="text-red-300 font-terminal text-sm mt-2">{error}</p>}

      {/* Current round */}
      <div className="w-full max-w-2xl px-4 mt-6 font-terminal">
        <p className="text-zinc-400 text-sm">
          {phase === "lobby" && (hasGame ? `${questions.length} questions ready. Waiting to start.` : "Generate a game to begin.")}
          {phase === "question" && `Round ${state.round}/${state.totalRounds} · ${state.answeredCount}/${state.playerCount} answered · ${Math.ceil(remaining / 1000)}s left`}
          {phase === "results" && `Round ${state.round}/${state.totalRounds} finished`}
          {phase === "finished" && "Game finished!"}
        </p>
        {state?.question && phase !== "finished" && (
          <div className="mt-2 border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-500 text-sm">{state.question.Category}</p>
            <p className="text-white text-lg my-2">{state.question.Question}</p>
            {state.question.Image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mediaUrl(state.question.Image)} alt="Quote" className="max-h-80 w-full object-contain rounded-md my-2" />
            )}
            <ul className="text-sm">
              {state.question.Answers.map((a) => {
                // only reveal the answer once the round is over (everyone voted or time ran out)
                const reveal = phase !== "question" && a === state.question.Answer
                return (
                  <li key={a} className={reveal ? "text-green-400" : "text-zinc-400"}>
                    {reveal ? "✔ " : "· "}{a}
                  </li>
                )
              })}
            </ul>
            {state.question.Audio && phase === "results" && (
              <div className="mt-3">
                <p className="text-zinc-400 text-sm mb-1">The real thing:</p>
                <audio key={state.question.Audio} controls autoPlay src={mediaUrl(state.question.Audio)} className="w-full" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Players / scoreboard */}
      <div className="flex-1 flex flex-col items-center px-4 mt-6">
        <p className="mb-4 font-bold">Players ({players.filter(p => p.connected !== false).length}):</p>
        <div className="flex flex-wrap justify-center gap-4">
          {scoreboard.map((entry, i) => {
            const player = players.find(p => p.userName === entry.userName)
            const connected = player?.connected !== false
            return (
              <DarkCard
                key={entry.userName}
                color={entry.color}
                initColor={entry.color}
                className={`player-card ${connected ? "" : "text-zinc-500"}`}
              >
                {phase !== "lobby" && `#${i + 1} `}{entry.userName} - Score: {entry.score}
                {phase === "question" && player?.answered && " ✔"}
                {!connected && " (left)"}
              </DarkCard>
            )
          })}
        </div>
      </div>
    </div>
  );
}
