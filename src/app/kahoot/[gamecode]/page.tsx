"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { socket } from "@/utils/socket"
import { LeaderboardEntry, Player, RoundResult } from "@/types/player";
import LobbyScreen from "./LobbyScreen";
import BeforeGameLobby from "./ConnectingLobby";
import QuestionScreen from "./QuestionScreen";
import FinishedScreen from "./FinishedScreen";

type GameState = "Connecting" | "Waiting" | "Lobby" | "Question" | "Finished";

interface QuestionData {
  Category: string;
  Question: string;
  Answers: string[];
  Image: string | null;
  round: number;
  totalRounds: number;
  introDelayMs: number;
  timeLimitMs: number;
}

interface JoinedData {
  userName: string;
  phase: "lobby" | "question" | "results" | "finished";
  round: number;
  totalRounds: number;
  score: number;
  answered: boolean;
}

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const { gamecode } = params;
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>('Connecting');
  const [userName, setUserName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const username = localStorage.getItem('userName');
    const color = localStorage.getItem('color');

    function backToLanding(message: string) {
      localStorage.setItem("InvalidCodeMessage", message);
      router.push("/kahoot");
    }

    if (!username) {
      backToLanding("Pick a username first");
      return;
    }
    setUserName(username);

    function join() {
      socket.emit("join", {
        gamecode,
        userName: username,
        color,
        sessionId: localStorage.getItem('sessionId'),
      });
    }

    function onDisconnect() {
      console.log('[CLIENT] Disconnected from server');
      setGameState("Connecting");
    }

    function onInvalidGamecode(message?: string) {
      console.log('[CLIENT] Invalid Code', message);
      backToLanding(message || "Oopsie woopsie, The game code that you used is incorrect >.<. You naughty naughty");
    }

    function onJoinError(message: string) {
      console.log('[CLIENT] Join error', message);
      backToLanding(message);
    }

    function onSessionAssigned(data: { sessionId: string }) {
      localStorage.setItem('sessionId', data.sessionId);
    }

    function onJoined(data: JoinedData) {
      console.log('[CLIENT] Joined', data);
      setUserName(data.userName);
      if (data.phase === "lobby") {
        setRoundResult(null);
        setGameState("Waiting");
      } else if (data.phase === "question" && data.answered) {
        setGameState("Lobby");
      } else if (data.phase === "results") {
        setGameState("Lobby");
      }
    }

    function onPlayersChange(players: Player[]) {
      setPlayers(players);
    }

    function onQuestion(questionData: QuestionData) {
      console.log("[CLIENT] Question", questionData);
      setRoundResult(null);
      setCurrentQuestion(questionData);
      setGameState("Question");
    }

    function onAnswerReceived() {
      setGameState("Lobby");
    }

    function onRoundResult(result: RoundResult) {
      console.log('[CLIENT] Round result', result);
      setRoundResult(result);
      setGameState("Lobby");
    }

    function onGameFinished(data: { leaderboard: LeaderboardEntry[] }) {
      console.log('[CLIENT] Game finished');
      setLeaderboard(data.leaderboard);
      setGameState("Finished");
    }

    function onGameReset() {
      setRoundResult(null);
      setCurrentQuestion(null);
      setGameState("Waiting");
    }

    socket.on('connect', join);
    socket.on('disconnect', onDisconnect);
    socket.on('invalid_gamecode', onInvalidGamecode);
    socket.on('joinError', onJoinError);
    socket.on('sessionAssigned', onSessionAssigned);
    socket.on('joined', onJoined);
    socket.on('playersUpdate', onPlayersChange);
    socket.on("NextRoundQuestion", onQuestion);
    socket.on("answerReceived", onAnswerReceived);
    socket.on("RoundResult", onRoundResult);
    socket.on('gameFinished', onGameFinished);
    socket.on('gameReset', onGameReset);

    if (socket.connected) join();
    else socket.connect();

    return () => {
      socket.off('connect', join);
      socket.off('disconnect', onDisconnect);
      socket.off('invalid_gamecode', onInvalidGamecode);
      socket.off('joinError', onJoinError);
      socket.off('sessionAssigned', onSessionAssigned);
      socket.off('joined', onJoined);
      socket.off('playersUpdate', onPlayersChange);
      socket.off("NextRoundQuestion", onQuestion);
      socket.off("answerReceived", onAnswerReceived);
      socket.off("RoundResult", onRoundResult);
      socket.off('gameFinished', onGameFinished);
      socket.off('gameReset', onGameReset);
    };
  }, [gamecode, router]);

  const submitAnswer = (answer: string) => {
    console.log('[CLIENT] Submitting answer:', answer);
    socket.emit("playerAnswer", { answer });
  };

  if (gameState === 'Connecting' || gameState === 'Waiting') {
    return <BeforeGameLobby players={players} />;
  } else if (gameState === 'Lobby') {
    return <LobbyScreen players={players} roundResult={roundResult} />;
  } else if (gameState === 'Question' && currentQuestion) {
    return (
      <QuestionScreen
        key={currentQuestion.round}
        onGotoLobby={() => setGameState('Lobby')}
        submitAnswer={submitAnswer}
        possibleAnswers={currentQuestion.Answers}
        question={currentQuestion.Question}
        image={currentQuestion.Image}
        fillerText={`${currentQuestion.Category}:`}
        introDelayMs={currentQuestion.introDelayMs}
        timeLimitMs={currentQuestion.timeLimitMs}
        round={currentQuestion.round}
        totalRounds={currentQuestion.totalRounds}
      />
    );
  } else if (gameState === 'Finished') {
    return <FinishedScreen leaderboard={leaderboard} userName={userName} />;
  }

  return <BeforeGameLobby players={players} />;
}
