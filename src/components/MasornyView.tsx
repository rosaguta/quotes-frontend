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
      <AnimatePresence>
        {expandedId && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedId(null)}
          >
            {data.filter(quote => quote.id === expandedId).map((quote) => (
              <motion.div
                key={`expanded-${quote.id}`}
                className="w-full flex justify-center max-w-4xl max-h-screen overflow-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1  }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 15 , duration: 0.5}}
                onClick={(e) => e.stopPropagation()}
              >
                <DarkCard color={color} borderColor={null}>
                  <div className='relative p-4'>
                    <div className="space-y-4">
                      <p className="text-gray-400 text-lg">
                        {quote.person} - {quote.dateTimeCreated}
                      </p>
                      <p className="text-gray-300 text-xl">{quote.text}</p>
                    </div>
                  </div>
                </DarkCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Masonry
        breakpointCols={breakpointColumns}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {data.map((quote) => (
          <motion.div
            key={quote.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleExpand(quote.id)}
            className="cursor-pointer mb-4"
            layoutId={`card-${quote.id}`}
          >
            <DarkCard color={color} borderColor={null}>
              <div className='relative select-none'>
                <div className="space-y-2">
                  <p className="text-gray-400 md:text-sm text-xs">
                    {quote.person} - {quote.dateTimeCreated}
                  </p>
                  <p className="text-gray-300 text-sm md:text-base">{quote.text}</p>
                </div>
              </div>
            </DarkCard>
          </motion.div>
        ))}
      </Masonry>
    </div>
  );
}