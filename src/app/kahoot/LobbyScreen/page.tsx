"use client"

import { Card } from "@/components/ui/card"
import DarkCard from "@/components/ui/DarkCard"
import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";

export default function LobbyScreen() {
    const [countdown, setCountdown] = useState(15);
    const [players] = useState([
        { name: "Rose", color: "#F27EBE", ready: true },
        { name: "Liv", color: "#35BDF2", ready: true },
        { name: "Daan", color: "#F2E74B", ready: false },
        { name: "Vika", color: "#4CAF50", ready: true },
        { name: "Robin", color: "#FF6B6B", ready: true },
        { name: "Gibby", color: "#9B59B6", ready: false },
    ]);

    useEffect(() => {
        // Main card border animation
        animate('.lobby-card', {
            borderColor: ['#F27EBE', '#35BDF2', '#F2E74B', '#4CAF50', '#F27EBE'],
            duration: 4000,
            ease: 'easeInOutQuad',
            direction: 'alternate',
            loop: true,
        });

        // Initial fade in
        animate('.lobby-card', {
            opacity: [0, 1],
            scale: [0.95, 1],
            duration: 1500,
            ease: 'easeOutExpo',
        });

        // Title animation
        animate('.lobby-title', {
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 500,
            delay: 300,
            ease: 'easeOutExpo',
        });

        // Subtitle animation
        animate('.lobby-subtitle', {
            opacity: [0, 1],
            duration: 1000,
            delay: 600,
            ease: 'easeOutExpo',
        });

        // Player cards stagger animation
        animate('.player-card', {
            scale: [0.8, 1],
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            delay: stagger(100, { start: 1000 }),
            ease: 'easeOutSine',
        });

        // Countdown circle animation
        animate('.countdown-circle', {
            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 1000,
            delay: 1800,
            ease: 'easeOut',
        });

        // Pulse animation for countdown
        animate('.countdown-number', {
            //   scale: [1, 1.1, 1],
            duration: 1000,
            loop: true,
            ease: 'easeInOutSine',
        });

        // Ready status pulse
        animate('.ready-indicator', {
            opacity: [0.7, 1, 0.7],
            //   scale: [1, 1.05, 1],
            duration: 2000,
            loop: true,
            ease: 'easeInOutSine',
        });

    }, []);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full h-dvh p-4 flex flex-col bg-black">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="lobby-title text-4xl font-terminal font-bold text-white mb-2 opacity-0">
                    Game Lobby
                </h1>
                <p className="lobby-subtitle text-lg font-terminal text-zinc-400 opacity-0">
                    Waiting for next round...
                </p>
            </div>

            {/* Main lobby card */}
            <div className="flex justify-center mb-6">
                <Card className="lobby-card px-6 py-8 flex flex-col items-center w-full max-w-2xl font-terminal border-2 opacity-0">


                    <p className="text-zinc-300 text-md mb-2">Please wait until everyone is finished</p>
                    <p className="text-zinc-500 text-sm">Get ready to answer!</p>
                </Card>
            </div>

            {/* Players grid */}
            <div className="flex-grow">
                <h2 className="text-center text-xl font-terminal text-white mb-4">
                    Players ({players.filter(p => p.ready).length}/{players.length} ready)
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
                    {players.map((player, index) => (
                        <div key={player.name} className="player-card opacity-0">
                            <DarkCard
                                // className={`border-[${player.color}]/80`}
                                direction="to_bottom_right"
                                color={player.color}
                                Style={{ borderColor: player.color }}
                            >
                                <span className="text-white font-medium text-lg z-10">
                                    {player.name}
                                </span>

                                <div className="flex items-center z-10">
                                    {player.ready ? (
                                        <div className="ready-indicator flex items-center">
                                            <div
                                                className="w-3 h-3 rounded-full mr-2"
                                                style={{ backgroundColor: player.color }}
                                            ></div>
                                            <span className="text-green-400 text-sm font-bold">READY</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full bg-zinc-600 mr-2"></div>
                                            <span className="text-zinc-400 text-sm">Waiting...</span>
                                        </div>
                                    )}
                                </div>

                            </DarkCard>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}