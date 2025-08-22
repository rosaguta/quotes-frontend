"use client"
import React from 'react';
import { motion } from 'framer-motion';
import DotPattern from './DotPattern';
import { cn } from '@/lib/utils';

const DarkCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, color, borderColor = null, initColor, className, direction = "to_bottom_left", ...rest }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const getGradientDirection = (dir: string) => {
    const directionMap: Record<string, string> = {
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

  const maskStyle = {
    '--mask-direction': getGradientDirection(direction),
    maskImage: `linear-gradient(var(--mask-direction), white, transparent, transparent)`,
    WebkitMaskImage: `linear-gradient(var(--mask-direction), white, transparent, transparent)`
  } as React.CSSProperties;

  return (
    <motion.div
      className={cn("relative max-w-md p-6 bg-black rounded-xl border-[0.5px] overflow-hidden", className)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ borderColor: borderColor }}
      {...rest}  
    >
      <div className="relative z-10">{children}</div>

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
      <div className="block md:hidden">
        <DotPattern
          width={12}
          height={12}
          cx={1}
          cy={1}
          cr={1}
          style={{
            ...maskStyle,
            fill: color,
            transition: "fill 0.2s ease-in-out"
          }}
        />
      </div>
    </motion.div>
  );
});

export default DarkCard;