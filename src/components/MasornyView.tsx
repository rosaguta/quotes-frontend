import { useState } from "react";
import { Quote } from "./columns";
import DarkCard from "./ui/DarkCard";
import Masonry from "react-masonry-css";
import { motion, AnimatePresence } from 'framer-motion';

export default function MasornyView({ data, color, initColor }: { data: Quote[], color: String, initColor: string }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<Number | null>(null)
  const breakpointColumns = {
    default: 5, // Default for large screens
    1100: 3, // 3 columns for widths <= 1100px
    700: 2, // 2 columns for widths <= 700px
    500: 1, // 1 column for widths <= 500px
  };

  const toggleExpand = (id: string, index: number) => {
    setExpandedId(expandedId === id ? null : id);
    setExpandedIndex(expandedIndex === index ? null : index)

  };

  return (
    <div className="grid justify-center z-10 relative">
      <Masonry
        breakpointCols={breakpointColumns}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {data.map((quote, index) => (
          <motion.div
            key={quote.id}
            layoutId={`card-container-${quote.id}`}
            onClick={() => toggleExpand(quote.id, (index + 1))}
            className="cursor-pointer mb-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <DarkCard className="" color={color} borderColor={null} initColor={initColor}>
              <motion.div className='relative select-none' layoutId={`card-content-${quote.id}`}>
                <div className="space-y-2">
                  <motion.p className="text-gray-400 md:text-sm text-xs flex justify-between" layoutId={`card-person-${quote.id}`}>
                    <p>{quote.person} - {quote.dateTimeCreated}</p>
                    <p>#{index + 1}</p>
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
            onClick={() => toggleExpand(null, null)}
          >
            <div className="" onClick={(e) => e.stopPropagation()}>
              {data.filter(quote => quote.id === expandedId).map((quote, index) => (
                <motion.div
                  key={`expanded-container-${quote.id}`}
                  layoutId={`card-container-${quote.id}`}
                  className="flex justify-center"
                >
                  <DarkCard color={color} borderColor={null} initColor={initColor} className="w-full">
                    <motion.div className='relative p-6 w-full' layoutId={`card-content-${quote.id}`}>
                      <div className="space-y-4">
                        <motion.p
                          className="text-gray-400 text-lg flex justify-between"
                          layoutId={`card-person-${quote.id}`}
                        >
                          <p>{quote.person} - {quote.dateTimeCreated}</p>
                          <p>#{expandedIndex.toString()}</p>
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