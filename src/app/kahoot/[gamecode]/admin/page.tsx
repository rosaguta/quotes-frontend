"use client"
import { socket } from '@/utils/socket'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from "next/navigation";
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
  AutoAdvanceSeconds: number;
}

const settingFields: { key: keyof GameSettings; label: string; min: number; max: number }[] = [
  { key: "TimePerQuestion", label: "Seconds / question", min: 5, max: 120 },
  { key: "ImageQuestions", label: "Image questions", min: 0, max: 50 },
  { key: "AudioQuestions", label: "Audio questions", min: 0, max: 50 },
  { key: "AutoAdvanceSeconds", label: "Auto next (s, 0 = off)", min: 0, max: 60 },
]

// same order + colors as the player QuestionScreen, so the TV matches the phones
const answerColors = ["#F27EBE", "#35BDF2", "#F2E74B", "#4CAF50"]

const GetSizeOfAnswer = ({question}: {question: string}) => {
  const length = question.length;
  console.log(length)
  if(length < 40) return "text-[clamp(1.5rem,2.2vw,3.5rem)]"
  if(length < 60) return "text-[clamp(1.5rem,2.2vw,2.25rem)]"
  if(length < 90) return "text-[clamp(1.5rem,2.2vw,1.5rem)]"
  if (length < 150) return "text-[clamp(1.5rem,2.2vw,1rem)]"
  return "text-[clamp(1.5rem,2.2vw,2.25rem)]"
}

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
  autoAdvanceMs: number; // > 0 while the results screen is counting down to the next question
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
    TimePerQuestion: "10", ImageQuestions: "5", AudioQuestions: "5", AutoAdvanceSeconds: "5",
  })
  const [customFiles, setCustomFiles] = useState<{ images: number, audio: number } | null>(null)
  const [remaining, setRemaining] = useState(0)
  const [autoRemaining, setAutoRemaining] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    animate('.player-chip', {
      translateY: [20, 0],
      opacity: [0, 1],
      delay: stagger(60),
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
      setAutoRemaining(s.autoAdvanceMs ?? 0)
    }
    function onGameSettings(s: GameSettings) {
      setSettings({
        TimePerQuestion: String(s.TimePerQuestion),
        ImageQuestions: String(s.ImageQuestions),
        AudioQuestions: String(s.AudioQuestions),
        AutoAdvanceSeconds: String(s.AutoAdvanceSeconds ?? 0),
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

  // local countdowns between server updates
  useEffect(() => {
    if (state?.phase === 'question') {
      const deadline = Date.now() + state.remainingMs
      const interval = setInterval(() => setRemaining(Math.max(0, deadline - Date.now())), 250)
      return () => clearInterval(interval)
    }
    if (state?.phase === 'results' && state.autoAdvanceMs > 0) {
      const deadline = Date.now() + state.autoAdvanceMs
      const interval = setInterval(() => setAutoRemaining(Math.max(0, deadline - Date.now())), 100)
      return () => clearInterval(interval)
    }
  }, [state])

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
  const canNext = hasGame && phase !== "question" && phase !== "finished"
  const scoreboard = state?.leaderboard ?? players
  const connectedCount = players.filter(p => p.connected !== false).length

  function handlePrepRandomGame() {
    setGenerating(true)
    setError(null)
    socket.emit('RandomPrepGame')
  }
  const nextRound = useCallback(() => {
    setError(null)
    socket.emit("NextRound")
  }, [])
  function endRound() {
    socket.emit("EndRound")
  }
  function holdAutoAdvance() {
    socket.emit("HoldAutoAdvance")
  }
  function endGame() {
    socket.emit("EndGame")
  }
  function saveSettings() {
    socket.emit("setGameSettings", settings)
  }
  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen()
    else document.documentElement.requestFullscreen?.()
  }

  // keyboard / presenter-remote shortcuts so the host can drive the TV without the mouse
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (target.closest("input, textarea, select, button")) return
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault()
        if (canNext) nextRound()
        else if (phase === "question") socket.emit("EndRound")
      } else if (e.key === "p" || e.key === "P") {
        socket.emit("HoldAutoAdvance")
      } else if (e.key === "h" || e.key === "H") {
        setShowControls(v => !v)
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [canNext, phase, nextRound])

  const totalMs = Math.max((state?.settings?.TimePerQuestion ?? 0) * 1000, remaining, 1)
  const secondsLeft = Math.ceil(remaining / 1000)
  const showImage = phase === "results" && !!state?.question?.Image
  const autoAdvancing = phase === "results" && !!state?.autoAdvanceMs
  const autoTotalMs = Math.max(Number(state?.settings?.AutoAdvanceSeconds ?? 0) * 1000, autoRemaining, 1)

  return (
    <div className="flex flex-col w-screen h-dvh overflow-hidden font-terminal text-white select-none">
      {/* Top bar: always readable from the couch */}
      <header className="flex items-center justify-between gap-6 px-[3vw] py-[1.5vh] border-b border-zinc-800">
        <div className="flex items-baseline gap-4">
          <span className="text-zinc-500 text-[clamp(0.9rem,1.4vw,1.75rem)]">CODE</span>
          <span id="HOSTMSG" className="font-bold tracking-widest text-[clamp(1.5rem,3vw,4rem)]">{gamecode}</span>
        </div>
        <div className="text-zinc-300 text-[clamp(1rem,1.8vw,2.25rem)]">
          {(phase === "question" || phase === "results") && state && `Round ${state.round} / ${state.totalRounds}`}
          {phase === "finished" && "Final results"}
          {phase === "lobby" && (hasGame ? `${questions.length} questions ready` : "")}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-300 text-[clamp(1rem,1.8vw,2.25rem)]">
            {connectedCount} {connectedCount === 1 ? "player" : "players"}
          </span>
          {/* small QR for late joiners once the game is running */}
          {phase !== "lobby" && joinUrl && (
            <div className="bg-white p-1.5 rounded-lg">
              <QRCodeSVG value={joinUrl} size={72} marginSize={0} className="w-[5vw] h-[5vw] min-w-14 min-h-14" />
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 min-h-0 px-[3vw] py-[2vh]">
        {phase === "lobby" && (
          <LobbyView joinUrl={joinUrl} gamecode={String(gamecode)} players={players} />
        )}

        {(phase === "question" || phase === "results") && state?.question && (
          <div className="h-full flex gap-[2vw]">
            <div className="flex-1 min-w-0 flex flex-col gap-[2vh]">
              {/* Question */}
              <div className="flex items-start gap-[2vw]">
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-400 text-[clamp(1rem,1.8vw,2.25rem)]">{state.question.Category}</p>
                  <p className="font-bold leading-tight mt-[1vh] text-[clamp(1.5rem,2.2vw,4.5rem)] line-clamp-4">
                    {state.question.Question}
                  </p>
                </div>
                {phase === "question" && (
                  <Countdown seconds={secondsLeft} fraction={remaining / totalMs}
                    answered={state.answeredCount} total={state.playerCount} />
                )}
              </div>

              {/* the image is the reveal, so only show it once everyone has answered */}
              {showImage && (
                <div className="flex-1 min-h-0 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaUrl(state.question.Image!)} alt="Quote" className="h-full max-w-full object-contain rounded-xl" />
                </div>
              )}

              {/* Answers: 2x2 grid in the same colors players see */}
              <div className={`grid grid-cols-2 gap-[1.5vw] ${showImage ? "h-[28vh]" : "flex-1 min-h-0"}`}>
                {state.question.Answers.map((a, i) => {
                  const color = answerColors[i % answerColors.length]
                  // only reveal the answer once the round is over (everyone voted or time ran out)
                  const revealed = phase === "results"
                  const correct = a === state.question!.Answer
                  const answerSizeClass = GetSizeOfAnswer({question: a})
                  return (
                    <div key={a}
                      className="relative flex items-center gap-[1.5vw] px-[2vw] rounded-2xl border-4 transition-all duration-500 overflow-hidden"
                      style={{
                        borderColor: color,
                        backgroundColor: revealed && correct ? `${color}33` : "#000",
                        opacity: revealed && !correct ? 0.3 : 1,
                        transform: revealed && correct ? "scale(1.02)" : undefined,
                      }}>
                      <span className="shrink-0 w-[2.5vw] h-[2.5vw] min-w-6 min-h-6 rounded-full" style={{ backgroundColor: color }} />
                      <span className={`font-bold leading-tight ${answerSizeClass} line-clamp-5`}>{a}</span>
                      {revealed && correct && <span className="ml-auto text-[clamp(1.5rem,3.5vw,5rem)] text-green-400">✔</span>}
                    </div>
                  )
                })}
              </div>

              {state.question.Audio && phase === "results" && (
                <div className="flex items-center gap-4">
                  <p className="text-zinc-400 text-[clamp(1rem,1.6vw,2rem)] shrink-0">The real thing:</p>
                  <audio key={state.question.Audio} controls autoPlay src={mediaUrl(state.question.Audio)} className="w-full" />
                </div>
              )}
            </div>

            {/* Side panel: who's answered during a question, standings after */}
            <aside className="w-[24vw] shrink-0 flex flex-col min-h-0 border-l border-zinc-800 pl-[2vw]">
              <p className="text-zinc-400 mb-[1.5vh] text-[clamp(1rem,1.6vw,2rem)]">
                {phase === "question" ? "Answered" : "Leaderboard"}
              </p>
              {phase === "question" ? (
                <div className="flex flex-col gap-[0.8vh] overflow-hidden">
                  {players.filter(p => p.connected !== false).map(p => (
                    <div key={p.userName} className="flex items-center gap-3 text-[clamp(0.9rem,1.5vw,1.9rem)] transition-opacity"
                      style={{ opacity: p.answered ? 1 : 0.35 }}>
                      <span className="w-[1vw] h-[1vw] min-w-3 min-h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="truncate">{p.userName}</span>
                      {p.answered && <span className="ml-auto text-green-400">✔</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <Leaderboard entries={scoreboard} players={players} limit={10} />
              )}
              {autoAdvancing && (
                <div className="mt-auto pt-[2vh]">
                  <p className="text-zinc-300 text-[clamp(1rem,1.6vw,2rem)]">
                    {isLastRound ? "Final results" : "Next question"} in <span className="font-bold text-white">{Math.ceil(autoRemaining / 1000)}</span>
                  </p>
                  <div className="h-2 mt-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-[#35BDF2] transition-[width] duration-100 ease-linear"
                      style={{ width: `${(autoRemaining / autoTotalMs) * 100}%` }} />
                  </div>
                </div>
              )}
            </aside>
          </div>
        )}

        {phase === "finished" && (
          <div className="h-full flex flex-col items-center">
            <h1 className="font-bold text-[clamp(2rem,5vw,7rem)] mb-[3vh]">Game over!</h1>
            <Podium entries={scoreboard} />
            <div className="w-full max-w-[60vw] mt-[3vh] min-h-0 flex-1 overflow-hidden">
              <Leaderboard entries={scoreboard.slice(3)} players={players} limit={7} startRank={4} />
            </div>
          </div>
        )}
      </main>

      {/* Host controls: hide with H so the TV shows only the game */}
      {showControls ? (
        <footer className="border-t border-zinc-800 bg-black/80 px-[3vw] py-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="lg" onClick={nextRound} disabled={!canNext}>{nextLabel}</Button>
            {phase === "question" && <Button size="lg" variant="outline" onClick={endRound}>End round now</Button>}
            {autoAdvancing && <Button size="lg" variant="outline" onClick={holdAutoAdvance}>Hold</Button>}
            <Button variant="outline" onClick={handlePrepRandomGame} disabled={generating || phase === "question"}>
              {generating ? "Generating..." : hasGame ? "New game" : "Generate game"}
            </Button>
            {hasGame && phase !== "lobby" && phase !== "finished" && (
              <Button variant="outline" onClick={endGame}>End game</Button>
            )}
            <Button variant="ghost" onClick={() => setShowSettings(v => !v)}>Settings {showSettings ? "▾" : "▸"}</Button>
            <Button variant="ghost" onClick={toggleFullscreen}>Fullscreen</Button>
            {error && <span className="text-red-300 text-sm ml-2">{error}</span>}
            <span className="ml-auto text-zinc-500 text-xs hidden lg:inline">
              Space / → next · P hold · F fullscreen · H hide controls
            </span>
          </div>
          {showSettings && (
            <div className="flex flex-wrap items-end gap-2 mt-3">
              {settingFields.map(({ key, label, min, max }) => (
                <div key={key}>
                  <Label htmlFor={key} className="text-xs text-zinc-400">{label}</Label>
                  <Input id={key} type="number" min={min} max={max} className="w-24"
                    value={settings[key]}
                    onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))} />
                </div>
              ))}
              <Button variant="outline" onClick={saveSettings} disabled={phase === "question"}>Save</Button>
              {customFiles && (
                <p className="text-zinc-500 text-xs">
                  Available: {customFiles.images} images · {customFiles.audio} audio clips (applies on the next generate)
                </p>
              )}
            </div>
          )}
        </footer>
      ) : (
        error && <p className="text-red-300 text-sm px-[3vw] pb-2">{error}</p>
      )}
    </div>
  );
}

function LobbyView({ joinUrl, gamecode, players }: { joinUrl: string, gamecode: string, players: Player[] }) {
  return (
    <div className="h-full flex gap-[4vw] items-center">
      <div className="flex flex-col items-center justify-center shrink-0">
        {joinUrl && (
          <div className="bg-white my-[2vh] p-[1vw] rounded-2xl">
            <QRCodeSVG value={joinUrl} size={512} marginSize={0} className="w-[min(30vw,55vh)] h-[min(30vw,55vh)]" />
          </div>
        )}
        <p className="mt-[2vh] text-[clamp(1.25rem,2.4vw,3rem)]">Scan to join</p>
        <p className="text-zinc-400 text-center text-[clamp(0.9rem,1.4vw,1.75rem)]">
          or go to <span className="text-white">{joinUrl.replace(/^https?:\/\//, "").replace(/\?.*$/, "")}</span>
        </p>
        <p className="text-zinc-400 text-[clamp(0.9rem,1.4vw,1.75rem)]">
          and enter <span className="text-white font-bold tracking-widest text-[clamp(1.5rem,2.8vw,3.5rem)]">{gamecode}</span>
        </p>
      </div>

      <div className="flex-1 h-full min-w-0 flex flex-col">
        <p className="text-zinc-400 mb-[2vh] text-[clamp(1.25rem,2.2vw,2.75rem)]">
          {players.length === 0 ? "Waiting for players…" : "Players"}
        </p>
        <div className="flex flex-wrap content-start gap-[1vw] overflow-hidden">
          {players.map(p => (
            <div key={p.userName}
              className="player-chip px-[1.5vw] py-[1vh] rounded-xl border-2 bg-black font-bold text-[clamp(1rem,2vw,2.5rem)]"
              style={{ borderColor: p.color, opacity: p.connected === false ? 0.35 : 1 }}>
              {p.userName}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Countdown({ seconds, fraction, answered, total }: { seconds: number, fraction: number, answered: number, total: number }) {
  const r = 45
  const c = 2 * Math.PI * r
  const urgent = seconds <= 3
  return (
    <div className="flex flex-col items-center shrink-0">
      <div className="relative w-[11vw] h-[11vw] min-w-24 min-h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#27272a" strokeWidth="8" />
          <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" strokeLinecap="round"
            stroke={urgent ? "#F27EBE" : "#35BDF2"}
            strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, Math.max(0, fraction)))}
            style={{ transition: "stroke-dashoffset 250ms linear, stroke 300ms" }} />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center font-bold text-[clamp(2rem,4.5vw,6rem)] ${urgent ? "text-[#F27EBE] animate-pulse" : ""}`}>
          {seconds}
        </span>
      </div>
      <p className="mt-[1vh] text-zinc-300 text-[clamp(1rem,1.6vw,2rem)]">{answered} / {total} answered</p>
    </div>
  )
}

function Leaderboard({ entries, players, limit, startRank = 1 }: { entries: LeaderboardEntry[], players: Player[], limit: number, startRank?: number }) {
  return (
    <ol className="flex flex-col gap-[0.8vh]">
      {entries.slice(0, limit).map((entry, i) => {
        const connected = players.find(p => p.userName === entry.userName)?.connected !== false
        return (
          <li key={entry.userName}
            className="flex items-center gap-3 px-[1vw] py-[0.8vh] rounded-lg border-l-4 bg-zinc-900/60 text-[clamp(0.9rem,1.5vw,1.9rem)]"
            style={{ borderColor: entry.color, opacity: connected ? 1 : 0.4 }}>
            <span className="text-zinc-500 w-[2.5ch] shrink-0">{i + startRank}</span>
            <span className="truncate">{entry.userName}</span>
            <span className="ml-auto font-bold tabular-nums">{entry.score}</span>
          </li>
        )
      })}
    </ol>
  )
}

function Podium({ entries }: { entries: LeaderboardEntry[] }) {
  // 2nd, 1st, 3rd from left to right
  const order = [1, 0, 2]
  const heights = ["h-[18vh]", "h-[26vh]", "h-[12vh]"]
  return (
    <div className="flex items-end justify-center gap-[2vw]">
      {order.map((idx, col) => {
        const e = entries[idx]
        if (!e) return <div key={idx} className="w-[16vw]" />
        return (
          <div key={e.userName} className="flex flex-col items-center w-[16vw]">
            <p className="font-bold truncate max-w-full text-[clamp(1.1rem,2.2vw,2.75rem)]">{e.userName}</p>
            <p className="text-zinc-400 tabular-nums text-[clamp(0.9rem,1.6vw,2rem)] mb-[1vh]">{e.score}</p>
            <div className={`w-full ${heights[col]} rounded-t-xl flex items-start justify-center pt-[1vh] font-bold text-black text-[clamp(1.5rem,3.5vw,4.5rem)]`}
              style={{ backgroundColor: e.color }}>
              {idx + 1}
            </div>
          </div>
        )
      })}
    </div>
  )
}
