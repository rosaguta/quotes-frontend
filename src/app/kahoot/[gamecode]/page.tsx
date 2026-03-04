"use client";
import { useEffect, useRef, useState } from "react";
import { animate, createTimer, utils } from 'animejs';
import { useParams, useRouter } from "next/navigation";
import { socket } from "@/utils/socket"
import { Player } from "@/types/player";
import LobbyScreen from "./LobbyScreen";
import BeforeGameLobby from "./ConnectingLobby";
import QuestionScreen from "./QuestionScreen";

type GameState = "Connecting" | "Lobby" | "Question";

interface QuestionData {
  Category: string;
  Question: string;
  Answers: string[];
}

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const { gamecode } = params;
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>('Connecting');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [roundNumber, setRoundNumber] = useState(0);
  const [userName, setUserName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);

  useEffect(() => {
    function onConnect() {
      console.log('[CLIENT] Connected to server');
      setIsConnected(true);
      // Move to lobby once connected and players are loaded
      setGameState("Lobby");
    }

    function onDisconnect() {
      console.log('[CLIENT] Disconnected from server');
      setIsConnected(false);
    }

    function returnToLanding(message: any) {
      console.log('[CLIENT] Invalid Code');
      console.log(message);
      localStorage.setItem("InvalidCodeMessage", "Oopsie woopsie, The game code that you used is incorrect >.<. You naughty naughty");
      router.push("/kahoot");
    }

    function onPlayersChange(players: Player[]) {
      console.log('[CLIENT] playersUpdate received:', players);
      setPlayers(players);
    }

    function advanceGame(questionData: QuestionData) {
      console.log("advance game is triggered", questionData);
      setCurrentQuestion(questionData);
      setGameState("Question");
    }

    function setRoundNbr(nbr: number) {
      console.log('[CLIENT] Round number:', nbr);
      setRoundNumber(nbr);
    }

    function onGameFinished() {
      console.log('[CLIENT] Game finished');
      // Handle game finished - maybe show results screen
      setGameState("Lobby");
    }

    function onSessionAssigned(data: { sessionId: string }) {
      console.log('[CLIENT] Session assigned:', data.sessionId);
      localStorage.setItem('sessionId', data.sessionId);
    }

    // Set up event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('playersUpdate', onPlayersChange);
    socket.on('invalid_gamecode', returnToLanding);
    socket.on("NextRoundQuestion", advanceGame);
    socket.on("RoundNbr", setRoundNbr);
    socket.on('gameFinished', onGameFinished);
    socket.on('sessionAssigned', onSessionAssigned);

    // Get user data from localStorage
    const username = localStorage.getItem('userName');
    const color = localStorage.getItem('color');
    
    if (username) {
      setUserName(username);
    }

    // Join the game
    socket.emit("join", { 
      gamecode, 
      userName: username, 
      color,
      sessionId: localStorage.getItem('sessionId')
    });

    // Cleanup function
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('playersUpdate', onPlayersChange);
      socket.off("invalid_gamecode", returnToLanding);
      socket.off("NextRoundQuestion", advanceGame);
      socket.off('RoundNbr', setRoundNbr);
      socket.off('gameFinished', onGameFinished);
      socket.off('sessionAssigned', onSessionAssigned);
    };
  }, [gamecode, router]);

  const submitAnswer = (answerObject: { answer: string, timeTaken: number }) => {
    const fullAnswer = {
      gameCode: gamecode,
      userName: userName,
      ...answerObject
    };
    console.log('[CLIENT] Submitting answer:', fullAnswer);
    socket.emit("playerAnswer", fullAnswer);
  };

  // Render based on game state
  if (gameState === 'Connecting') {
    return <BeforeGameLobby players={players} />;
  } else if (gameState === 'Lobby') {
    return <LobbyScreen players={players} />;
  } else if (gameState === 'Question' && currentQuestion) {
    return (
      <QuestionScreen
        onGotoLobby={() => setGameState('Lobby')}
        submitAnswer={submitAnswer} 
        possibleAnswers={currentQuestion.Answers} 
        question={currentQuestion.Question}
        fillerText={`${currentQuestion.Category}:`}
      />
    );
  }

  // Fallback for unexpected states
  return <div>Something went wrong...</div>;
}