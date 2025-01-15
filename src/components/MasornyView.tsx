import { Quote } from "./columns"
import { CardSpotlight } from "./ui/card-spotlight"
import Masonry from "react-masonry-css";
export default function MasornyView({ data }: { data: Quote[] }) {
  const breakpointColumns = {
    default: 5, // Default for large screens
    1100: 3,    // 3 columns for widths <= 1100px
    700: 2,     // 2 columns for widths <= 700px
    500: 1,     // 1 column for widths <= 500px
  };
  return (
    <div className="grid justify-center">
      <Masonry
        breakpointCols={breakpointColumns}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {data.map((quote) => (
          <CardSpotlight key={quote.id} className='masonry-item max-w-80' colors={[[39, 42, 242], [200, 17, 237]]}>
            <div className='relative select-none'>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">
                  {quote.person} - {quote.dateTimeCreated}
                </p>
                <p className="text-gray-300">{quote.text}</p>
              </div>
            </div>
          </CardSpotlight>
        ))}
      </Masonry>
    </div>
  )
}