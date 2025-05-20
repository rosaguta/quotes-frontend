"use client"
import React from 'react';
import { motion } from 'framer-motion';
import DotPattern from './DotPattern';
import { cn } from '@/lib/utils';
const DarkCard = ({ children, color, borderColor = null , initColor, className}) => {
  const [isHovered, setIsHovered] = React.useState(false);
 
  return (
    <motion.div
      className={cn("relative max-w-md p-6 bg-black rounded-xl border-[0.5px] overflow-hidden", className)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ borderColor: borderColor }}
    >
      <div className="relative z-10">
        {children}
      </div>
      {/* desktop */}
      <div className="hidden md:block"> 
        <DotPattern
          width={12}
          height={12}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "[mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)] ")}
          style={{
            fill: isHovered ? color : initColor, // Adjusted to hover state
            transition: "fill 0.2s ease-in-out"
          }}
        />
      </div>
      {/* phone */}
      <div className='block md:hidden'> 
      <DotPattern
          width={12}
          height={12}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "[mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]")}
          style={{
            fill: true ? color : "rgba(156, 163, 175, 0.8)", // Adjusted to hover state
            transition: "fill 0.2s ease-in-out"
          }}
        />
      </div>
    </motion.div>
  );
};

export default DarkCard;
