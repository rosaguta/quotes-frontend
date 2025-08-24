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
  const [gameState, setGameState] = useState<GameState>('Connecting');
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [roundNumber, setRoundNumber] = useState(0)
  const [userName, setUserName] = useState("")
  // if(!isConnected){
  //   setPlayers([
  //       { userName: "Rose", color: "#F27EBE", ready: true, score: 0, joinedAt:0 },
  //       { userName: "Liv", color: "#35BDF2", ready: true, score: 0, joinedAt:0 },
  //       { userName: "Daan", color: "#F2E74B", ready: false, score: 0, joinedAt:0 },
  //       { userName: "Vika", color: "#4CAF50", ready: true, score: 0, joinedAt:0 },
  //       { userName: "Robin", color: "#FF6B6B", ready: false, score: 0, joinedAt:0 },
  //       { userName: "Gibby", color: "#9B59B6", ready: true, score: 0, joinedAt:0 },
  //   ])
  // }
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
    function advanceGame(){
      console.log("advance game is triggered")
      setGameState("Question")
    }
    function setRoundNbr(nbr:number){
      setRoundNumber(nbr)
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('playersUpdate', onPlayersChange);
    socket.on('invalid_gamecode', returnToLanding)
    socket.on("NextRoundQuestion", advanceGame)
    socket.on("RoundNbr", setRoundNbr)
    const username = localStorage.getItem('userName')
    setUserName(username)
    const color = localStorage.getItem('color')

    socket.emit("join", { gamecode, userName, color })
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('playersUpdate', onPlayersChange);
      socket.off("invalid_gamecode",returnToLanding);
      socket.off("NextRoundQuestion",advanceGame);
      socket.off('RoundNbr', setRoundNbr);
    };
  }, [])
  const submitAnswer = (answerObject) => {
    const fullanswer = {
      gameCode: gamecode,
      userName: userName,
      ...answerObject
    }
    console.log(fullanswer)
    socket.emit("playerAnswer", fullanswer);
  };

  

  if (gameState === 'Connecting') {
    return <BeforeGameLobby players={players} />;
  } else if (gameState === 'Lobby') {
    return <LobbyScreen players={players} />;
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