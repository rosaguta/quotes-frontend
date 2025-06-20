"use client"
import { socket } from '@/utils/socket'
import { useState, useEffect } from 'react'
import { useParams } from "next/navigation";
import DarkCard from '@/components/ui/DarkCard';
import { Player } from '@/types/player';


export default function AdminPanel() {
  const params = useParams();
  const [players, setPlayers] = useState<Player[]>([])
  const { gamecode } = params
  console.log(params)
  console.log(gamecode)

  useEffect(() => {
    function adminRegistered(gamecode) {
      console.log(`[admin] connected to ${gamecode}`)

    }
    function onPlayersChange(players) {
      console.log('[ADMIN] playersUpdate received:', players);
      setPlayers(players);
    }
    socket.on('connect', () => {
      console.log('[admin] connected');
    });
    socket.on('adminRegistered', (gamecode) => {
      adminRegistered(gamecode)
    })
    socket.on('playersUpdate', onPlayersChange)

    socket.emit('registerAdmin', { gamecode })

    return () => {
      socket.off('connect')
      socket.off('playerUpdate', onPlayersChange)
      socket.off('adminRegistered', adminRegistered)
    };
  }, [gamecode]);
  console.log('players', players)


  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex justify-center pt-6">
        <h1 id="HOSTMSG" className="font-terminal font-bold text-xs md:text-lg">HOST VIEW</h1>
      </div>

      <div className="flex justify-center mt-4">
        <div id='logo'>
          <svg className='w-[200px] h-[200px]' width="170" height="130" viewBox="0 0 170 149" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1_127)" stroke="currentColor" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <path className="line" d="M 77.082 46.853 C 74.229 27.139 64.658 1.208 34.78 1.208 C 15.571 1.208 1.577 18.456 1.661 37.089 C 1.763 58.83 17.698 69.472 39.422 72.953 C 40.773 73.172 42.241 73.392 43.777 73.594 C 55.07 75.149 63.477 84.829 63.477 96.248 C 63.477 116.672 48.268 133.598 28.585 136.285 C 25.479 136.706 23.116 139.274 23.116 142.416 L 23.116 142.704 C 23.116 146.471 25.837 147.935 29.567 147.445 C 55.546 143.998 73.706 126.419 77.099 96.265 C 77.099 96.265 79.952 66.601 77.099 46.887 L 77.082 46.853 Z"></path>
              <path className="line" d="M 159.961 47 C 157.108 27.286 147.537 1.355 117.659 1.355 C 98.45 1.355 84.456 18.603 84.54 37.236 C 84.642 58.977 100.577 69.619 122.301 73.1 C 123.652 73.319 125.12 73.539 126.656 73.741 C 137.949 75.296 146.356 84.976 146.356 96.395 C 146.356 116.819 131.147 133.745 111.464 136.432 C 108.358 136.853 105.995 139.421 105.995 142.563 L 105.995 142.851 C 105.995 146.618 108.716 148.082 112.446 147.592 C 138.425 144.145 156.585 126.566 159.978 96.412 C 159.978 96.412 162.831 66.748 159.978 47.034 L 159.961 47 Z"></path>
            </g>
            <defs>
              <clipPath id="clip0_1_127">
                <rect width="170" height="149" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <p className="mb-4 font-bold">Players:</p>
        <div className="flex flex-wrap justify-center gap-4">
          {players.map((player, index) => (
            <DarkCard key={index} color={player.color} borderColor={null} initColor={player.color}>
              {player.userName} - Score: {player.score}
            </DarkCard>
          ))}
        </div>
      </div>
    </div>
  );
}