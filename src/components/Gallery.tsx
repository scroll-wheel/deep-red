import { Button } from '@/components/ui/button';

import { ChevronLeft, ChevronRight } from 'lucide-react';

type Source = {
  url: string;
  width: number;
  height: number;
};

type Image = {
  media: 'image';
  sources: Source[];

  caption: string | null;
};

type Video = {
  media: 'video';
  poster: Image | null;
  hls_url: string;
  dash_url: string;
  fallback_url: string;
  height: number;
  width: number;

  caption: string | null;
};

type Media = Image | Video;

function Gallery({ media }: { media: Media[] }) {
  return (
    <div className="gallery relative">
      <ul className="images flex overflow-x-hidden scroll-smooth align-center">
        {media.map((media) => (
          // TODO: Key
          <li className="grow-0 shrink-0 basis-full">
            <figure className="h-full relative z-1 flex flex-col justify-center overflow-y-hidden"></figure>
          </li>
        ))}
      </ul>

      {media.length && (
        <nav className="w-full flex justify-between items-center absolute inset-y-0 px-1">
          <div>
            <Button
              variant="secondary"
              size="icon-lg"
              className="prev rounded-full opacity-50 relative z-1 hidden"
            >
              <ChevronLeft />
            </Button>
          </div>
          <div>
            <Button
              variant="secondary"
              size="icon-lg"
              className="prev rounded-full opacity-50 relative z-1 hidden"
            >
              <ChevronRight />
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
