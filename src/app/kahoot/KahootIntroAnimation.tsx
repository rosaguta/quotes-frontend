"use client";
import { useEffect, useRef } from "react";
import { animate, createScope, createSpring, svg, stagger } from "animejs";
import DarkCard from "@/components/ui/DarkCard";

export default function KahootIntroAnimation({ quotes, onDone }: { quotes: any[], onDone: () => void }) {
  const root = useRef(null);
  const scope = useRef(null);

  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      animate(".card-0", {
        opacity: [0, 1],
        x: [
          { from: 2000, to: 0, duration: 1500, delay: 500 },
          { from: 0, to: -2000, duration: 1500, delay: 1000, ease: "inQuad" },
        ],
        easing: "easeOutExpo",
        ease: createSpring({ stiffness: 50 }),
        delay: 500,
      });

      animate(".card-2", {
        opacity: [0, 1],
        x: [
          { from: -2000, to: 0, duration: 1500, delay: 1000 },
          { from: 0, to: 2000, duration: 1500, delay: 1000, ease: "inQuad" },
        ],
        easing: "easeInOutQuad",
        duration: 1000,
        ease: createSpring({ stiffness: 50 }),
        delay: 500,
      });

      animate(".card-1", {
        opacity: [0, 1],
        x: [
          { from: 2000, to: 0, duration: 1500, delay: 1500 },
          { from: 0, to: -2000, duration: 1500, delay: 1000, ease: "inQuad" },
        ],
        easing: "easeOutExpo",
        ease: createSpring({ stiffness: 50 }),
        delay: 500,
      });

      return () => scope.current?.revert();
    });
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone(); 
    }, 5000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={root} className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="grid grid-cols-1 gap-4 px-4 sm:px-6 md:px-0 md:gap-6 md:max-w-4xl mt-5">
        {quotes.map((section, i) => (
          <DarkCard
            key={i}
            color={section.color}
            borderColor={section.color}
            initColor={section.initColor}
            className={`card-${i} opacity-0 w-full scale-90 sm:scale-100 md:scale-100 max-w-xs sm:max-w-sm md:max-w-xl`}
          >
            <div className="relative select-none">
              <div>
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    {section.title}
                  </h2>
                  {section.icon}
                </div>
                <div className="space-y-1 sm:space-y-2">
                  {section.person ? (
                    <>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {section.person} - {section.dateTimeCreated}
                      </p>
                    </>
                  ) : (
                    <p className="text-red-300 font-terminal text-xs sm:text-sm m-0">
                      {"<<PERSON REDACTED>>"}
                      <span className="inline text-gray-400 text-xs font-normal sm:text-sm m-0">
                        {" - " + section.dateTimeCreated}
                      </span>
                    </p>
                  )}
                  {section.context ? (
                    <>
                      <p className="text-red-300 font-terminal text-xs sm:text-sm">{"<<QUOTE REDACTED>>"}</p>
                      <hr />
                      <p className="text-xs sm:text-sm text-gray-300">{section.context}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs sm:text-sm md:text-base text-gray-300">{section.text}</p>
                      <hr />
                      <p className="text-xs sm:text-sm font-terminal text-red-300">{"<<CONTEXT REDACTED>>"}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </DarkCard>
        ))}
      </div>
    </div>
  );
}