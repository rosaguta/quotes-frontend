export type Player = {
  userName: string,
  joinedAt: number,
  score: number,
  color: string,
  ready: boolean,
  answered?: boolean,
  connected?: boolean
}

export type LeaderboardEntry = {
  userName: string,
  color: string,
  score: number,
  connected?: boolean
}

export type RoundResult = {
  answer: string | null,
  correct: boolean,
  points: number,
  correctAnswer: string,
  audio: string | null,
  score: number,
  rank: number,
  round: number,
  totalRounds: number,
  isLastRound: boolean
}
