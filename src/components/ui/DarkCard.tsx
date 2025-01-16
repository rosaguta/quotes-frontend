import React from 'react';
import { motion } from 'framer-motion';
const DarkCard = ({ children }) => {
  return (
    <div className="relative max-w-md p-6 bg-black rounded-xl border-[0.5px] border-[#d51f73] overflow-hidden">
      <motion.div className="bg-black w-full h-full absolute z-10 inset-0" initial={{scale:1.0}} whileHover={{ scale: 0.0, }}>
        
        </motion.div>
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(#d51f73 0.5px, transparent 0)',
            backgroundSize: '13px 13px',
          }}>

        </div>
      
      <div className="relative z-10">
        {children}

      </div>
    </div>
  );
};

export default DarkCard;