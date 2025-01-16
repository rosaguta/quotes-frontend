import { Quote } from "./columns"
import { CardSpotlight } from "./ui/card-spotlight"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Masonry from "react-masonry-css";
export default function MasornyView({ data }: { data: Quote[] }) {
  const breakpointColumns = {
    default: 5, // Default for large screens
    1100: 3,    // 3 columns for widths <= 1100px
    700: 2,     // 2 columns for widths <= 700px
    500: 1,     // 1 column for widths <= 500px
  };
  return (
    <div className="grid justify-center z-10">
      <Masonry
        breakpointCols={breakpointColumns}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {data.map((quote) => (
          <Card className="p-8 bg-black">
            <div className='relative select-none'>
              <div className="space-y-2">
                <p className="text-gray-400 md:text-sm text-xs">
                  {quote.person} - {quote.dateTimeCreated}
                </p>
                <p className="text-gray-300 text-sm md:text-base">{quote.text}</p>
              </div>
            </div>
          </Card>
        ))}
      </Masonry>
    </div>
  )
}