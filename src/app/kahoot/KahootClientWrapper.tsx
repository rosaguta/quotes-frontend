'use client';
import { useEffect, useState, useRef } from 'react';
import KahootIntroAnimation from './KahootIntroAnimation';
import TitleAnimationGame from "./TitleAnimation"
import Game from './Game';

export default function KahootClientWrapper({ quotes }: { quotes: any[] }) {
    const [phase, setPhase] = useState<'intro' | 'second' | 'game'>('intro');
    

    return (
        <div className='h-screen w-screen flex flex-col items-center justify-center overflow-hidden'>
            {phase === 'intro' && (
                <KahootIntroAnimation quotes={quotes} onDone={() => setPhase('second')} />
            )}
            {phase === 'second' && (
                <TitleAnimationGame />
            )}
            {/* {phase === 'game' && (
                <Game />
            )} */}
        </div>
    );
}
