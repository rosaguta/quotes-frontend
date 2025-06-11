"use client";
import { useEffect, useRef, useState } from "react";
import { animate, createTimer, utils } from 'animejs';
import { useParams } from "next/navigation";
import { GetColor } from "@/utils/Color";

export default function Page() {
  const root = useRef(null);
  const params = useParams();
  const scope = useRef(null);
  const { gamecode } = params;
  const orbitContainer = useRef(null);
  const [players, setPlayers] = useState(["Rose", "Robin", "Liv", "Gibby", "stijn"]);
  const particlesRef = useRef([]);
  const timersRef = useRef([]);

  const freq = 0.05;
  let i = 0;

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newColor = GetColor(freq, i);
  //     const hostmsg = document.getElementById("HOSTMSG")
  //     hostmsg.style.color = newColor
  //     i++
  //   }, 100);

  //   return () => clearInterval(interval);
  // },[]);

  // Function to clean up existing animations and particles
  const cleanup = () => {
    // Stop all timers
    timersRef.current.forEach(timer => {
      if (timer && timer.pause) timer.pause();
    });
    timersRef.current = [];

    // Remove all particle elements
    particlesRef.current.forEach(particle => {
      if (particle && particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    particlesRef.current = [];
  };

  // Function to create animation for a single particle
  const animateParticle = ($el, particleIndex, totalParticles) => {
    const $logo = document.querySelector('#logo');
    if (!$logo) return null;

    const baseRadius = $logo.offsetWidth / 1.1;
    const activeRadius = $logo.offsetWidth / 1.75;

    // Calculate unique angle for each particle
    const angleStep = (Math.PI * 2) / totalParticles;
    let currentAngle = particleIndex * angleStep;

    const pointer = { x: 0, y: 0, isDown: false, radius: baseRadius };

    const timer = createTimer({
      frameRate: 60,
      onUpdate: () => {
        // Slowly rotate the angle to create circular motion
        currentAngle += 0.01; // Adjust this value to control rotation speed
        const radius = pointer.isDown ? activeRadius : baseRadius;

        animate($el, {
          x: {
            to: (Math.cos(currentAngle) * radius) + pointer.x,
            // duration: () => utils.random(500, 1000)
          },
          y: {
            to: (Math.sin(currentAngle) * radius) + pointer.y,
            // duration: () => utils.random(500, 1000)
          },
          duration: () => utils.random(1000, 1500),
          ease: `inOut(${utils.random(1, 5)})`,
          composition: 'blend'
        });
      }
    });

    return timer;
  };

  // Function to initialize animations
  const initializeAnimations = () => {
    const $animationWrapper = document.querySelector('#animation-wrapper');
    if (!$animationWrapper) return;

    // Filter out empty players
    const activePlayers = players.filter(player => player && player.trim() !== '');
    const colors = ['red', 'orange', 'lightorange'];

    activePlayers.forEach((player, i) => {
      const $particle = document.createElement('div');
      $particle.classList.add('particle');
      $particle.textContent = player; // Display player name
      $particle.style.position = 'absolute';
      $particle.style.padding = '8px 12px';
      $particle.style.borderRadius = '8px';
      $particle.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      $particle.style.border = '1px solid rgba(255, 255, 255, 0.2)';
      $particle.style.fontSize = '14px';
      $particle.style.fontWeight = 'bold';
      $particle.style.userSelect = 'none';
      $particle.style.pointerEvents = 'none';
      $particle.style.boxShadow = 'none';
      $particle.style.opacity = "5";
      $particle.style.position = "absolute";

      utils.set($particle, {
        color: `var(--${colors[utils.random(0, colors.length - 1)]})`
      });

      $animationWrapper.appendChild($particle);
      particlesRef.current.push($particle);

      // Create animation timer for this particle
      const timer = animateParticle($particle, i, activePlayers.length);
      if (timer) {
        timersRef.current.push(timer);
      }
    });
  };

  // Effect that runs when players array changes
  useEffect(() => {
    // Clean up previous animations
    cleanup();

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      initializeAnimations();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      cleanup();
    };
  }, [players]); // Re-run when players array changes

  // Functions to add/remove players for testing
  const addPlayer = () => {
    const newPlayerNames = ["gibby", "Stijn", "Benjamin"];
    const unusedNames = newPlayerNames.filter(name => !players.includes(name));
    if (unusedNames.length > 0) {
      const randomName = unusedNames[Math.floor(Math.random() * unusedNames.length)];
      setPlayers(prev => [...prev, randomName]);
    }
  };

  const removePlayer = () => {
    if (players.length > 0) {
      setPlayers(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="w-screen h-screen">
      <div className="flex mt-14 justify-center">
        <h1 id="HOSTMSG" className="font-terminal font-bold text-xs">please wait until the host starts the game...</h1>

      </div>
      <div className=""
        id="animation-wrapper">
        <div id='logo'>
          <svg className='w-[200ox] h-[200ox]' width="170" height="130" viewBox="0 0 170 149" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    </div>
  );
}