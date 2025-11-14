import { Button } from "@/components/ui/button";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { type Media } from "@/lib/media";

import { cn } from "@/lib/utils";

import { useState, useRef, useEffect } from "react";

import videojs from "video.js";
import "video.js/dist/video-js.css";

export function Gallery({ media }: { media: Media[] }) {
  const [index, setIndex] = useState(0);
  const oListRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const ol = oListRef.current;
    if (ol) {
      const scrollLeftMax = ol.scrollWidth - ol.clientWidth;
      const width = scrollLeftMax / (media.length - 1);
      ol.scrollLeft = index * width;
    }
  }, [index, media.length]);

  return (
    <div className="relative">
      <ol
        ref={oListRef}
        className="images flex overflow-x-hidden scroll-smooth align-center"
      >
        {media.map((media, index) => (
          // TODO: Key
          <li key={index} className="grow-0 shrink-0 basis-full">
            <figure className="h-full relative z-1 flex flex-col justify-center overflow-y-hidden rounded-xl">
              {media.media === "image" ? (
                <>
                  <img
                    src={media.largestSource().url}
                    alt={media.caption || undefined}
                    className="absolute size-full"
                    loading="lazy"
                    sizes="(min-width: 768px) 768px, 100vw"
                    srcSet={media.srcset()}
                  />
                  {/* TODO: Grey background works with both light and dark mode */}
                  <div className="absolute size-full bg-background/75 backdrop-blur-lg"></div>
                  <img
                    src={media.largestSource().url}
                    alt={media.caption || undefined}
                    className="relative m-auto max-h-[100vw] sm:max-h-[540px]"
                    loading="lazy"
                    sizes="(min-width: 768px) 768px, 100vw"
                    srcSet={media.srcset()}
                  />
                  {media.caption && (
                    <figcaption className="relative text-center">
                      {media.caption}
                    </figcaption>
                  )}
                </>
              ) : (
                <>
                  {media.poster !== null && (
                    <>
                      <img
                        src={media.poster.largestSource().url}
                        alt={media.caption || undefined}
                        className="absolute size-full"
                        loading="lazy"
                        sizes="(min-width: 768px) 768px, 100vw"
                        srcSet={media.poster.srcset()}
                      />
                      {/* TODO: Grey background works with both light and dark mode */}
                      <div className="absolute size-full bg-background/75 backdrop-blur-lg"></div>
                    </>
                  )}
                  <VideoJS
                    options={{
                      controls: true,
                      preload: "auto",
                      // TODO: Optimize
                      width: largestFit(media.width, media.height)[0],
                      height: largestFit(media.width, media.height)[1],
                      // poster: media.poster?.largestSource().url,
                      sources: [
                        {
                          src: media.hls_url,
                          type: "application/x-mpegURL",
                        },
                        {
                          src: media.dash_url,
                          type: "application/dash+xml",
                        },
                        {
                          src: media.fallback_url,
                          type: "video/mp4",
                        },
                      ],
                    }}
                    onReady={() => {}}
                  />
                </>
              )}
            </figure>
          </li>
        ))}
      </ol>

      <nav className="w-full flex justify-between items-center absolute inset-y-0 px-1">
        <div>
          <Button
            variant="secondary"
            size="icon-lg"
            className={cn(
              "prev rounded-full opacity-50 relative z-1",
              index === 0 ? "hidden" : ""
            )}
            onClick={() => setIndex((i) => i - 1)}
          >
            <ChevronLeft />
          </Button>
        </div>
        <div>
          <Button
            variant="secondary"
            size="icon-lg"
            className={cn(
              "prev rounded-full opacity-50 relative z-1",
              index === media.length - 1 ? "hidden" : ""
            )}
            onClick={() => setIndex((i) => i + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </nav>
    </div>
  );
}

function largestFit(width: number, height: number): [number, number] {
  const maxWidth = Math.min(768, window.innerWidth);
  const maxHeight = Math.min(540, window.innerHeight);

  // if (width <= maxWidth && height <= maxHeight) {
  //   return [width, height];
  // }

  const s1 = maxWidth / width;
  const s2 = maxHeight / height;

  const a1 = [Math.floor(s1 * width), Math.floor(s1 * height)];
  const a2 = [Math.floor(s2 * width), Math.floor(s2 * height)];

  if (a1[1] > maxHeight) {
    // return a2;
    return [Math.floor(s2 * width), Math.floor(s2 * height)];
  }
  if (a2[0] > maxWidth) {
    // return a1;
    return [Math.floor(s1 * width), Math.floor(s1 * height)];
  }

  if (a1[0] * a1[1] > a2[0] * a2[1]) {
    // return a1;
    return [Math.floor(s1 * width), Math.floor(s1 * height)];
  } else {
    // return a2;
    return [Math.floor(s2 * width), Math.floor(s2 * height)];
  }
}

function VideoJS({ options, onReady }: { options: any; onReady: any }) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs>>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      if (videoRef.current) {
        const observer = new IntersectionObserver((e) => {
          e.forEach((e) => {
            // e.target.childElementCount === 0 needed for development when useEffect is called multiple times
            if (e.target.childElementCount === 0 && e.isIntersecting) {
              // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
              const videoElement = document.createElement("video-js");

              videoElement.classList.add("vjs-big-play-centered");
              e.target.appendChild(videoElement);

              // TODO: This causes a bunch of lag when multiple of these are called at once
              const player = (playerRef.current = videojs(
                videoElement,
                options,
                () => {
                  videojs.log("player is ready");
                  if (onReady) {
                    onReady(player);
                  }
                }
              ));

              observer.unobserve(e.target);
            }
          });
        });
        observer.observe(videoRef.current);
      }
    } else {
      // You could update an existing player in the `else` block here
      // on prop change, for example:
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, onReady, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className="vjs-default-skin m-auto">
      <div ref={videoRef} />
    </div>
  );
}
