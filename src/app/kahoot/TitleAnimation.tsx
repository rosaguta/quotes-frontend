"use client"
import { useEffect ,useRef, useState } from "react";
import { animate, createScope, utils, svg, stagger } from "animejs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {useRouter} from "next/navigation"
export default function TitleAnimationGame() {
  const router = useRouter()
  const root = useRef(null);
  const scope = useRef(null);
  const inputRef = useRef(null);
  const standbyAnimationRef = useRef(null);
  const [gameCode, setGameCode] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [canJoin, setCanJoin] = useState<boolean>(false)
  const getRandomPos = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  const [submitEnabled, setSubmitEnabled] = useState(false)

  const handleJoinClick = () => {
    console.log("Join clicked, gameCode:", gameCode); // Debug log
    
    if (!gameCode.trim()) {
      alert("Please enter a game code");
      return;
    }
    localStorage.setItem("userName", userName)
    localStorage.setItem("gameCode", gameCode)
    setCanJoin(true)
    // Play outro animation
    const outro = animate('.root', {
      opacity: [1, 0],
      duration: 1500,
      ease: 'inOutQuint',
      onComplete: () => {
        console.log("Animation complete, redirecting to:", `/kahoot/${gameCode}`); // Debug log
        router.push(`/kahoot/${gameCode}`);
      }
    });
  };

  useEffect(() => {

    localStorage.clear()

    scope.current = createScope({ root }).add(() => {
      animate(".svgWrapper", {
        opacity: [0, 1],
      });
      animate(".questions", {
        opacity: [0, 1, 1, 1, 0],
        translateX: (el, i) => [getRandomPos(50, 100), getRandomPos(50, 100)],
        translateY: (el, i) => [getRandomPos(-200, 50), getRandomPos(-200, 50)],
        delay: stagger(750),
      });

      standbyAnimationRef.current = animate(".standby", {
        opacity: [0, 1, 0],
        delay: 15000,
        loop: true,
        duration: 2000,
        ease: 'inOutQuad'
      });
      animate(svg.createDrawable('.line'), {
        draw: ['0 0', '0 1', "1 1", "0 0", '0 1'],
        ease: 'inOutQuad',
        duration: 3000,
        delay: stagger(250),
        // loop: 1,
        // opacity: [0, 1]
      });
      animate('.game', {
        opacity: [0, 1],
        delay: 5000
      })
      
      const inputElement = inputRef.current;
      const stopStandbyAnimation = () => {
        standbyAnimationRef.current?.restart();
        inputElement.removeEventListener("input", stopStandbyAnimation);
      };
      inputElement?.addEventListener("input", stopStandbyAnimation);

      return () => {
        scope.current?.revert();
        inputElement?.removeEventListener("input", stopStandbyAnimation);
      };
    });
  }, [])
  const handleDisabledButton = () =>{
    if(userName.length == 0 && gameCode.length == 0){
      setSubmitEnabled(false)
    }
    setSubmitEnabled(true)
  }
  return (
    <div ref={root} className="overflow-hidden root">
      <div className="flex flex-col items-center justify-center overflow-hidden">
        <div className="svgWrapper opacity-0">
          <svg width="170" height="130" viewBox="0 0 170 149" fill="none" xmlns="http://www.w3.org/2000/svg" >
            <g clipPath="url(#clip0_1_127)" stroke="currentColor" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <path className="line" d="M 77.082 46.853 C 74.229 27.139 64.658 1.208 34.78 1.208 C 15.571 1.208 1.577 18.456 1.661 37.089 C 1.763 58.83 17.698 69.472 39.422 72.953 C 40.773 73.172 42.241 73.392 43.777 73.594 C 55.07 75.149 63.477 84.829 63.477 96.248 C 63.477 116.672 48.268 133.598 28.585 136.285 C 25.479 136.706 23.116 139.274 23.116 142.416 L 23.116 142.704 C 23.116 146.471 25.837 147.935 29.567 147.445 C 55.546 143.998 73.706 126.419 77.099 96.265 C 77.099 96.265 79.952 66.601 77.099 46.887 L 77.082 46.853 Z" ></path>
              <path className="line" d="M 159.961 47 C 157.108 27.286 147.537 1.355 117.659 1.355 C 98.45 1.355 84.456 18.603 84.54 37.236 C 84.642 58.977 100.577 69.619 122.301 73.1 C 123.652 73.319 125.12 73.539 126.656 73.741 C 137.949 75.296 146.356 84.976 146.356 96.395 C 146.356 116.819 131.147 133.745 111.464 136.432 C 108.358 136.853 105.995 139.421 105.995 142.563 L 105.995 142.851 C 105.995 146.618 108.716 148.082 112.446 147.592 C 138.425 144.145 156.585 126.566 159.978 96.412 C 159.978 96.412 162.831 66.748 159.978 47.034 L 159.961 47 Z" ></path>
            </g>
            <defs>
              <clipPath id="clip0_1_127">
                <rect width="170" height="149" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      <div className="-z-50">
        <p className="questions absolute text-neutral-500">Who said that?!?!</p>
        <p className="questions absolute text-neutral-500">???</p>
        <p className="questions absolute text-neutral-500">WAIT WHAT?</p>
        <p className="questions absolute text-neutral-500">Now THATS funny</p>
        <p className="questions absolute text-neutral-500">Context hello?!?!</p>
        <p className="questions absolute text-neutral-500">huh??</p>
      </div>
      <div className="game grid grid-cols-1 place-items-center gap-3 opacity-0 z-10 mt-20">
        <p className="standby text-yellow-100 font-terminal text-sm">Please stand by to retrieve the code</p>
        <Label className="place-self-start">Game Code</Label>
        <Input
          id="game code"
          onChange={e => setGameCode(e.target.value)}
          required
          value={gameCode}
          ref={inputRef}
        />
        <Label className="place-self-start">Username</Label>
        <Input
          id="username"
          onChange={e => setUserName(e.target.value)}
          required
          value={userName}
          ref={inputRef}
        />
        <Button disabled={submitEnabled} className="join w-20" onClick={handleJoinClick}>Join</Button>
        {canJoin && (
          <div className="text-green-300">Have Fun!!!</div>
        )}
      </div>
    </div>
  );
}