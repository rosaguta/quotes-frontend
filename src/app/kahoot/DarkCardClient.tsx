"use client";
import { useEffect, useRef } from "react";
import { animate, createScope, createSpring } from "animejs";
import DarkCard from "@/components/ui/DarkCard";

export default function DarkCardClient({ quotes }) {
  const root = useRef(null);
  const scope = useRef(null);



  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      animate(".card-0", {
        opacity: 1,
        translateY: [1000, 0],
        easing: "easeOutExpo",
        ease: createSpring({ stiffness: 70 }),
        delay: 1000,
      });
      animate(".card-1", {
        opacity: 1,
        translateX: [-1000, 0],
        easing: "easeInOutQuad",
        ease: createSpring({ stiffness: 70 }),
        delay: 2000,
      });
      animate(".card-2", {
        opacity: 1,
        translateX: [1000, 0],
        easing: "easeOutExpo",
        ease: createSpring({ stiffness: 70 }),
        delay: 3000,
      });

      return () => scope.current?.revert();
    });
  }, []);

  return (
<div ref={root} className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden">
  {/* TODO: make quote svg and animate it by flashing it or smtin*/}
    <img src="/quote.svg"></img>
  <div className="mb-4 text-sm text-gray-400 font-mono bg-black/30 px-4 py-2 rounded shadow">
    System Log: Loaded {quotes.length} quotes.
  </div>

  <div className="grid grid-cols-2 gap-6 max-w-4xl">
    {quotes.map((section, i) => (
      <div
        key={section.title}
        className={i === 0 ? "col-span-2 flex justify-center" : ""}
      >
        <DarkCard
          color={section.color}
          borderColor={section.color}
          initColor={section.initColor}
          className={`card-${i} w-full`}
        >
          <div className="relative select-none">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl min-w-72 font-bold text-white">
                  {section.title}
                </h2>
                {section.icon}
              </div>
              <div className="space-y-2">
                {section.person ? (
                  <>
                    <p className="text-gray-400 text-sm">
                      {section.person} - {section.dateTimeCreated}
                    </p>
                  </>
                ) : (
                  <span className="flex space-x-2 items-center">
                    <p className="text-red-300 font-terminal text-sm m-0">{"<<PERSON REDACTED>>"}</p>
                    <p className="text-gray-400 text-sm m-0">- {section.dateTimeCreated}</p>
                  </span>
                )}
                {section.context ? (
                  <>
                    <p className="text-red-300 font-terminal">{"<<QUOTE REDACTED>>"}</p>
                    <hr />
                    <p className="text-sm text-gray-300">{section.context}</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-300">{section.text}</p>
                    <hr />
                    <p className="text-sm font-terminal text-red-300">{"<<CONTEXT REDACTED>>"}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </DarkCard>
      </div>
    ))}
  </div>
</div>
  );
}
