import React from 'react';
import { motion } from 'framer-motion';
import DotPattern from './DotPattern';
import { cn } from '@/lib/utils';
const DarkCard = ({ children }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className="relative max-w-md p-6 bg-black rounded-xl border-[0.5px] overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ borderColor: "#d51f73" }}
    >
      <div className="relative z-10">
        {children}
      </div>
      <DotPattern
        width={12}
        height={12}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]")}
        style={{
          fill: isHovered ? "#d51f73" : "rgba(156, 163, 175, 0.8)", // Adjusted to hover state
        }}
      />
    </motion.div>
  );
};

export default DarkCard;
