"use client"

import { useEffect } from "react";
import { animate, stagger } from "animejs";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card"
import DarkCard from "@/components/ui/DarkCard"
import { Button } from "@/components/ui/button";
import { LeaderboardEntry } from "@/types/player";
import { socket } from "@/utils/socket";

interface FinishedScreenProps {
  leaderboard: LeaderboardEntry[];
  userName: string;
}

const medals = ["🥇", "🥈", "🥉"];

export default function FinishedScreen({ leaderboard, userName }: FinishedScreenProps) {
  const router = useRouter();
  const myRank = leaderboard.findIndex((e) => e.userName === userName) + 1;

  useEffect(() => {
    animate('.finished-card', {
      borderColor: ['#F27EBE', '#35BDF2', '#F2E74B', '#4CAF50', '#F27EBE'],
      duration: 4000,
      ease: 'easeInOutQuad',
      direction: 'alternate',
      loop: true,
    });
    animate('.leaderboard-row', {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      delay: stagger(120, { start: 300 }),
      ease: 'easeOutExpo',
    });
  }, []);

  return (
    <div className="w-full h-dvh p-4 flex flex-col items-center bg-black font-terminal">
      <h1 className="text-4xl font-bold text-white mt-6 mb-2">Game over!</h1>
      {myRank > 0 && (
        <p className="text-lg text-zinc-400 mb-6">
          You finished #{myRank} of {leaderboard.length}
        </p>
      )}

      <Card className="finished-card w-full max-w-xl p-4 border-2 flex flex-col gap-3">
        {leaderboard.map((entry, i) => (
          <div key={entry.userName} className="leaderboard-row opacity-0">
            <DarkCard
              color={entry.color}
              className="max-w-none w-full py-3"
              style={{ borderColor: entry.userName === userName ? entry.color : undefined }}
            >
              <div className="flex justify-between items-center">
                <span className="text-white">
                  {medals[i] ?? `#${i + 1}`} {entry.userName}
                </span>
                <span className="text-zinc-300">{entry.score}</span>
              </div>
            </DarkCard>
          </div>
        ))}
      </Card>

      <p className="text-zinc-500 text-sm mt-6">Wait for the host to start a new game, or</p>
      <Button className="mt-2" onClick={() => { socket.emit("leaveGame"); router.push("/kahoot"); }}>Leave</Button>
    </div>
  );
}
