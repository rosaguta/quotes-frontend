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
  const submitAnswer = (answerObject) => {
    console.log(answerObject)
    socket.emit("playerAnswer", answerObject);
  };
  if (gameState === 'Connecting') {
    return <BeforeGameLobby players={[
        { userName: "Rose", color: "#F27EBE", ready: true, score: 0, joinedAt:0 },
        { userName: "Liv", color: "#35BDF2", ready: true, score: 0, joinedAt:0 },
        { userName: "Daan", color: "#F2E74B", ready: false, score: 0, joinedAt:0 },
        { userName: "Vika", color: "#4CAF50", ready: true, score: 0, joinedAt:0 },
        { userName: "Robin", color: "#FF6B6B", ready: false, score: 0, joinedAt:0 },
        { userName: "Gibby", color: "#9B59B6", ready: true, score: 0, joinedAt:0 },
    ]} />;
  } else if (gameState === 'Lobby') {
    return <LobbyScreen players={[
        { userName: "Rose", color: "#F27EBE", ready: true, score: 0, joinedAt:0 },
        { userName: "Liv", color: "#35BDF2", ready: true, score: 0, joinedAt:0 },
        { userName: "Daan", color: "#F2E74B", ready: false, score: 0, joinedAt:0 },
        { userName: "Vika", color: "#4CAF50", ready: true, score: 0, joinedAt:0 },
        { userName: "Robin", color: "#FF6B6B", ready: false, score: 0, joinedAt:0 },
        { userName: "Gibby", color: "#9B59B6", ready: true, score: 0, joinedAt:0 },
    ]} />;
  } else if (gameState === 'Question') {
    return <QuestionScreen
      onGotoLobby={() => setGameState('Lobby')}
      submitAnswer={submitAnswer} 
      possibleAnswers={["Rose", "Liv", "Vika", "Daan"]} 
      question="Live in my walls? how about u live in my balls"
      fillerText="No way _____ said this:"/>;
  }

  // Fallback for unexpected states
  return <div>Something went wrong...</div>;
}