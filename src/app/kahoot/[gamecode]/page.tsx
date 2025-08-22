"use client";
import { useEffect, useRef, useState } from "react";
import { animate, createTimer, utils } from 'animejs';
import { useParams, useRouter } from "next/navigation";
import { socket } from "@/utils/socket"
import { Player } from "@/types/player";
import LobbyScreen from "./LobbyScreen";
import BeforeGameLobby from "./ConnectingLobby";
import QuestionScreen from "./QuestionScreen";

type GameState = "Connecting" | "Lobby" | "Question"

export default function Page() {
  const router = useRouter()
  const params = useParams();
  const { gamecode } = params;
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>('Question');
  const particlesRef = useRef([]);
  const timersRef = useRef([]);
  const [isConnected, setIsConnected] = useState(socket.connected)

  useEffect(() => {
    function onConnect() {
      console.log('[CLIENT] Connected to server');
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log('[CLIENT] Disconnected from server');
      setIsConnected(false);
    }
    function returnToLanding(message: any) {

      console.log('[CLIENT] Invalid Code');
      console.log(message)
      localStorage.setItem("InvalidCodeMessage", "Oopsie woopsie, The game code that you used is incorrect >.<. You naughty naughty")
      router.push("/kahoot")
    }
    function onPlayersChange(players) {
      console.log('[CLIENT] playersUpdate received:', players);
      setPlayers(players);
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('playersUpdate', onPlayersChange);
    socket.on('invalid_gamecode', returnToLanding)
    const userName = localStorage.getItem('userName')

    const color = localStorage.getItem('color')

    socket.emit("join", { gamecode, userName, color })
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('playersUpdate', onPlayersChange);
    };
  }, [])
  if (gameState === 'Connecting') {
    return <BeforeGameLobby socket={socket} />;
  } else if (gameState === 'Lobby') {
    return <LobbyScreen socket={socket} />;
  } else if (gameState === 'Question') {
    return <QuestionScreen socket={socket} onGotoLobby={() => setGameState('Lobby')} />;
  }

  // Fallback for unexpected states
  return <div>Something went wrong...</div>;
}