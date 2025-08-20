"use client"
import React from 'react';
import { motion } from 'framer-motion';
import DotPattern from './DotPattern';
import { cn } from '@/lib/utils';

const DarkCard = ({ children, color, borderColor = null, initColor, className, direction = "to_bottom_left", Style }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Map direction prop to CSS gradient direction
  const getGradientDirection = (dir) => {
    const directionMap = {
      'to_bottom_left': 'to bottom left',
      'to_bottom_right': 'to bottom right', 
      'to_top_left': 'to top left',
      'to_top_right': 'to top right',
      'to_bottom': 'to bottom',
      'to_top': 'to top',
      'to_left': 'to left',
      'to_right': 'to right'
    };
    return directionMap[dir] || 'to bottom left';
  };

  // Create CSS custom property for the mask
  const maskStyle = {
    '--mask-direction': getGradientDirection(direction),
    maskImage: `linear-gradient(var(--mask-direction), white, transparent, transparent)`,
    WebkitMaskImage: `linear-gradient(var(--mask-direction), white, transparent, transparent)`
  };
  
  return (
    <motion.div
      style={Style}
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
          style={{
            ...maskStyle,
            fill: isHovered ? color : initColor,
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
          style={{
            ...maskStyle,
            fill: true ? color : "rgba(156, 163, 175, 0.8)",
            transition: "fill 0.2s ease-in-out"
          }}
        />
      </div>
    </motion.div>
  );
};

export default DarkCard;