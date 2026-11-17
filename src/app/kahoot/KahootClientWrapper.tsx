'use client';
import { useEffect, useState, useRef } from 'react';;
import dynamic from 'next/dynamic';

// TitleAnimation reads window/localStorage during initial render, so skip SSR
const TitleAnimationGame = dynamic(() => import('./TitleAnimation'), { ssr: false });

export default function KahootClientWrapper() {
    const [phase, setPhase] = useState<'intro' | 'second' | 'game'>('intro');
    

    return (
        <div className='h-screen w-screen flex flex-col items-center justify-center overflow-hidden'>
            {phase === 'intro' && (
                <TitleAnimationGame />
            )}
        </div>
    );
}
