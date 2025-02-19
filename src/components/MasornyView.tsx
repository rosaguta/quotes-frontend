import { useState } from "react";
import { Quote } from "./columns";
import { CardSpotlight } from "./ui/card-spotlight";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import DarkCard from "./ui/DarkCard";
import Masonry from "react-masonry-css";
import { motion, AnimatePresence } from 'framer-motion';

export default function MasornyView({ data, color }: { data: Quote[], color: String }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const breakpointColumns = {
    default: 5, // Default for large screens
    1100: 3, // 3 columns for widths <= 1100px
    700: 2, // 2 columns for widths <= 700px
    500: 1, // 1 column for widths <= 500px
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="grid justify-center z-10 relative">
      <Masonry
        breakpointCols={breakpointColumns}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {data.map((quote) => (
          <motion.div
            key={quote.id}
            layoutId={`card-container-${quote.id}`}
            onClick={() => toggleExpand(quote.id)}
            className="cursor-pointer mb-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <DarkCard color={color} borderColor={null}>
              <motion.div className='relative select-none' layoutId={`card-content-${quote.id}`}>
                <div className="space-y-2">
                  <motion.p className="text-gray-400 md:text-sm text-xs" layoutId={`card-person-${quote.id}`}>
                    {quote.person} - {quote.dateTimeCreated}
                  </motion.p>
                  <motion.p className="text-gray-300 text-sm md:text-base" layoutId={`card-text-${quote.id}`}>
                    {quote.text}
                  </motion.p>
                </div>
              </motion.div>
            </DarkCard>
          </motion.div>
        ))}
      </Masonry>

      <AnimatePresence>
        {expandedId && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedId(null)}
          >
            <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              {data.filter(quote => quote.id === expandedId).map((quote) => (
                <motion.div
                  key={`expanded-container-${quote.id}`}
                  layoutId={`card-container-${quote.id}`}
                  className="w-full flex justify-center"
                >
                  <DarkCard color={color} borderColor={null}>
                    <motion.div className='relative p-6' layoutId={`card-content-${quote.id}`}>
                      <div className="space-y-4">
                        <motion.p 
                          className="text-gray-400 text-lg" 
                          layoutId={`card-person-${quote.id}`}
                        >
                          {quote.person} - {quote.dateTimeCreated}
                        </motion.p>
                        <motion.p 
                          className="text-gray-300 text-xl" 
                          layoutId={`card-text-${quote.id}`}
                        >
                          {quote.text}
                        </motion.p>
                      </div>
                    </motion.div>
                  </DarkCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}