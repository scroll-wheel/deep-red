export type Source = {
  url: string;
  width: number;
  height: number;
};

export type Video = {
  media: "video";
  poster: Image | null;
  hls_url: string;
  dash_url: string;
  fallback_url: string;
  height: number;
  width: number;

  caption: string | null;
};

export type Media = Image | Video;

export class Image {
  readonly media = "image";
  readonly sources: Source[];
  readonly caption: string | null;

  constructor(sources: Source[], caption: string | null = null) {
    this.caption = caption;
    this.sources = sources
      // .filter(
      //   (source) => !source.url.includes("fit=crop&crop=faces%2Centropy&arh=2")
      // )
      // .map((source) => {
      //   source.url = source.url.replaceAll(
      //     "g.redditmedia.com",
      //     "external-preview.redd.it"
      //   );
      //   return source;
      // });
      .filter(
        (source) =>
          !source.url.includes("g.redditmedia.com") &&
          !source.url.includes("i.redditmedia.com")
      );
  }

  largestSource(): Source {
    return this.sources.reduce((max, source) =>
      source.width * source.height > max.width * max.height ? source : max
    );
  }

  srcset(): string {
    return this.sources.map((s) => `${s.url} ${s.width}w`).join();
  }
}
