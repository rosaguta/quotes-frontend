"use client";
import { useEffect, useRef, useState } from "react";
import { animate, createScope, createSpring, stagger } from "animejs";
import DarkCard from "@/components/ui/DarkCard";

export default function Kahoot() {
  const root = useRef(null);
  const scope = useRef(null);
  const [quote, setQuote] = useState(null)
  const [rizz, setRizz] = useState(null)
  const [insult, setInsult] = useState(null)

  const sections = [
    {
      title: 'Quotes',
      ...quote,
      href: '/quotes',
      color: "#9803fc",
      initColor: "#5d3678"
    },
    {
      title: 'Rizz',
      ...rizz,
      href: '/rizz',
      color: "#fc03fc",
      initColor: "#631663"
    },
    {
      title: 'Insults',
      ...insult,
      href: '/insults',
      color: "#ff0000",
      initColor: "#753535"
    }
  ];
  useEffect(() => {
    const formatDate = (isoString) => {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    const fetchData = async () => {
      const fetchEndpoint = async (endpoint) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/${endpoint}/random?asObject=true`)
        return await response.json()
      }
      const [fetchedQuote, fetchedRizz, fetchedInsult] = await Promise.all([
        fetchEndpoint("quotes"),
        fetchEndpoint("rizzes"),
        fetchEndpoint("insults")
      ]);

      fetchedQuote.dateTimeCreated = formatDate(fetchedQuote.dateTimeCreated)
      fetchedRizz.dateTimeCreated = formatDate(fetchedRizz.dateTimeCreated)
      fetchedInsult.dateTimeCreated = formatDate(fetchedInsult.dateTimeCreated)

      setQuote(fetchedQuote)
      setRizz(fetchedRizz)
      setInsult(fetchedInsult)
    }

    fetchData()

  }, [])

  useEffect(() => {
  scope.current = createScope({ root }).add(() => {
    const directions = [
      { translateX: [-200, 0] }, // First card: from left
      { translateY: [200, 0] },  // Second card: from bottom
      { translateX: [200, 0] }   // Third card: from right
    ];

    animate(".card",{
      opacity: 1,
      x: (_, i) => directions[i].translateX?.[0] ?? directions[i].translateX?.[1],
      y: (_, i) => directions[i].translateX?.[0] ?? directions[i].translateX?.[1],
      delay: stagger(100),
      // duration: 800,
      easing: "easeOutExpo",
      
    });

    return () => scope.current?.revert();
  });
}, []);

  return (
    <div ref={root} className="h-screen w-screen flex items-center justify-center bg-black">
      <div className="grid grid-cols-5 gap-4">
        {sections.map((section) => (
          <DarkCard key={section.title} color={section.color} borderColor={section.color} initColor={section.initColor} className="card">
            <div className='relative select-none'>
              <div>
                <div className="flex items-center justify-between mb-4 ">
                  <h2 className="text-2xl min-w-72 font-bold text-white">{section.title}</h2>
                  {section.icon}
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">
                    {section.person} - {section.dateTimeCreated}
                  </p>
                  <p className="text-gray-300">{section.text}</p>
                </div>
              </div>
            </div>
          </DarkCard>
        ))}
      </div>
    </div>
  );
}
