import { type RedditPost } from "@/arctic-shift/RS";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import RFM from "@/components/Markdown";
import {
  ArrowBigDown,
  ArrowBigUp,
  Award,
  MessageCircle,
  Share,
} from "lucide-react";

import { cn, formatDate, webArchive } from "@/lib/utils";
import { Gallery } from "@/components/Gallery";
import { type Source, Image, type Media } from "@/lib/media";
import { NavLink } from "react-router";

type CrosspostParent = NonNullable<RedditPost["crosspost_parent_list"]>[number];

function convert(c: CrosspostParent): RedditPost {
  const result: any = c;
  if (result.can_gild === null) {
    result.can_gild = undefined;
  }
  return result;
}

class NormalizedPost {
  readonly author: string;
  readonly created_utc: Date;
  readonly crosspost_parent: NormalizedPost | null;
  readonly id: string;
  readonly link_flair_text: string | null;
  readonly num_comments: number;
  readonly media: Media[];
  readonly over_18: boolean;
  readonly permalink: string;
  readonly score: number;
  readonly selftext: string | null;
  readonly subreddit: string;
  readonly thumbnail: Source | null;
  readonly title: string;
  readonly url: URL | null;

  is_crosspost_parent: boolean;

  constructor(rp: RedditPost) {
    if (typeof rp.subreddit === "undefined") {
      throw new Error("undefined subreddit");
    }

    if (typeof rp.created_utc === "string" && isNaN(parseInt(rp.created_utc))) {
      throw new Error("created_utc is not a number");
    }

    // TODO: Addition doesn't work...
    const media: Media[] = [];

    // Video from .media.reddit_video
    {
      const reddit_video = rp.media?.reddit_video;
      if (
        typeof reddit_video !== "undefined" &&
        reddit_video.hls_url &&
        reddit_video.dash_url &&
        reddit_video.fallback_url &&
        reddit_video.height &&
        reddit_video.width
      ) {
        media.push({
          media: "video",
          caption: null,
          poster: null,
          hls_url: reddit_video.hls_url,
          dash_url: reddit_video.dash_url,
          fallback_url: reddit_video.fallback_url,
          height: reddit_video.height,
          width: reddit_video.width,
        });
      }
    }

    // Video from .preview.reddit_video_preview
    const reddit_video_preview = rp.preview?.reddit_video_preview;
    if (typeof reddit_video_preview !== "undefined") {
      media.push({
        media: "video",
        caption: null,
        poster: null,
        hls_url: reddit_video_preview.hls_url,
        dash_url: reddit_video_preview.dash_url,
        fallback_url: reddit_video_preview.fallback_url,
        height: reddit_video_preview.height,
        width: reddit_video_preview.width,
      });
    }

    // Video posters from .preview
    for (const video of media) {
      const images = rp.preview?.images;
      if (
        video.media === "video" &&
        typeof images !== "undefined" &&
        images.length !== 0
      ) {
        video.poster = new Image(
          [images[0].source].concat(images[0].resolutions)
        );
      }
    }

    if (media.length === 0) {
      // Images .gallery_data and .media_metadata
      if (rp.gallery_data && rp.media_metadata) {
        media.push(
          ...rp.gallery_data.items
            .filter(
              (item) =>
                item.media_id in rp.media_metadata! &&
                rp.media_metadata![item.media_id].status === "valid"
            )
            .map((item) => {
              const metadata = rp.media_metadata![item.media_id];
              const sources: Source[] = [];

              if (metadata.m !== "image/gif") {
                sources.push(
                  ...(metadata.p
                    ? metadata.p.map((source) => {
                        return {
                          url: source.u,
                          width: source.x,
                          height: source.y,
                        };
                      })
                    : [])
                );
              }

              if (metadata.s) {
                if (metadata.s.gif) {
                  sources.push({
                    url: metadata.s.gif,
                    width: metadata.s.x,
                    height: metadata.s.y,
                  });
                } else if (metadata.s.u) {
                  sources.push({
                    url: metadata.s.u,
                    width: metadata.s.x,
                    height: metadata.s.y,
                  });
                }
              }

              return new Image(sources, item.caption ? item.caption : null);
            })
        );
      }

      // Images from .preview
      if (
        rp.preview &&
        (typeof rp.preview.enabled === "undefined" || rp.preview.enabled)
      ) {
        media.push(
          ...rp.preview.images.map(
            (image) =>
              new Image(
                image.variants.gif
                  ? [image.variants.gif.source].concat(
                      image.variants.gif.resolutions
                    )
                  : [image.source].concat(image.resolutions)
              )
          )
        );
      }
    }

    const thumbnail =
      rp.thumbnail_width &&
      rp.thumbnail_height &&
      rp.thumbnail &&
      rp.thumbnail !== "nsfw"
        ? {
            url: rp.thumbnail,
            width: rp.thumbnail_width,
            height: rp.thumbnail_height,
          }
        : null;

    this.author = rp.author || "[deleted]";
    this.created_utc = new Date(+rp.created_utc * 1000);
    this.crosspost_parent =
      rp.crosspost_parent_list && rp.crosspost_parent_list.length !== 0
        ? new NormalizedPost(convert(rp.crosspost_parent_list[0]))
        : null;
    this.id = rp.id;
    this.link_flair_text = rp.link_flair_text;
    this.media = media
      .filter(
        (media) => !(media.media === "image" && media.sources.length === 0)
      )
      .map((media) => {
        if (media.media === "video" && media.poster?.sources.length === 0) {
          media.poster = null;
        }
        return media;
      });
    this.num_comments = rp.num_comments;
    this.over_18 = rp.over_18;
    this.permalink = rp.permalink;
    this.score = rp.score || 0;
    this.selftext = rp.selftext || null;
    this.subreddit = rp.subreddit!;
    this.title = rp.title;
    this.thumbnail = thumbnail;
    this.url =
      !this.crosspost_parent && rp.url && !rp.url.includes(rp.permalink)
        ? new URL(rp.url)
        : null;

    this.is_crosspost_parent = false;
    if (this.crosspost_parent) {
      this.crosspost_parent.is_crosspost_parent = true;
    }
  }
}

function Post({
  data: post,
  preview,
  show_subreddit,
}: {
  data: RedditPost;
  preview: boolean;
  show_subreddit: boolean;
}) {
  return PostHelper({
    post: new NormalizedPost(post),
    preview,
    show_subreddit,
  });
}

function href(post: NormalizedPost): string {
  if (post.url!.hostname.endsWith("gfycat.com")) {
    return webArchive(post.url!, post.created_utc);
  }
  if (post.url!.hostname.endsWith("i.reddituploads.com")) {
    return webArchive(post.url!, post.created_utc);
  }
  if (post.over_18 && post.url!.hostname.endsWith("imgur.com")) {
    return webArchive(post.url!, post.created_utc);
  }
  return post.url!.toString();
}

function PostHelper({
  post: p,
  preview,
  show_subreddit,
}: {
  post: NormalizedPost;
  preview: boolean;
  show_subreddit: boolean;
}) {
  const article = (
    <article
      className={cn(
        "relative hover:bg-ghost",
        p.is_crosspost_parent ? "bg-card rounded-xl border" : "my-4"
      )}
    >
      <header
        className={cn("debug mb-1.5", p.is_crosspost_parent && "p-4 pb-1.5")}
      >
        {p.is_crosspost_parent ? (
          <div className="text-sm">
            r/{p.subreddit}{" "}
            <span className="text-muted-foreground">
              {" "}
              · {formatDate(p.created_utc)}
            </span>
          </div>
        ) : (
          <div className="flex items-center">
            <Avatar>
              <AvatarFallback></AvatarFallback>
            </Avatar>
            {show_subreddit ? (
              <div>
                <div>
                  r/{p.subreddit} · {formatDate(p.created_utc)}
                </div>
                <div className="text-xs">{p.author}</div>
              </div>
            ) : (
              <div>
                u/{p.author} · {formatDate(p.created_utc)}
              </div>
            )}
          </div>
        )}
        <h2 className="scroll-m-20 text-xl md:text-2xl font-semibold tracking-tight line-clamp-6">
          {p.title}
        </h2>
        {p.link_flair_text && !p.is_crosspost_parent && (
          <Badge variant="outline">{p.link_flair_text}</Badge>
        )}
      </header>
      <section
        className={cn(
          "my-1.5",
          preview && "line-clamp-6",
          p.is_crosspost_parent && "px-4"
        )}
      >
        {p.crosspost_parent ? (
          <PostHelper
            post={p.crosspost_parent}
            preview={preview}
            show_subreddit={show_subreddit}
          />
        ) : p.media.length ? (
          <Gallery media={p.media} />
        ) : p.url ? (
          <a
            target="_blank"
            className="relative z-1 flex justify-between"
            href={href(p)}
          >
            <span className="line-clamp-1">{p.url.toString()}</span>
            {p.thumbnail && <img loading="lazy" src={p.thumbnail.url} alt="" />}
          </a>
        ) : p.selftext && preview ? (
          <div>{p.selftext}</div>
        ) : (
          <></>
        )}
        {p.selftext && !preview && <RFM plaintext={p.selftext} />}
      </section>
      <footer>
        {p.is_crosspost_parent ? (
          <div className="text-muted-foreground text-sm mx-4 my-3">
            {p.score} upvotes · {p.num_comments} comments
          </div>
        ) : (
          <>
            <Button variant="secondary" className="rounded-full mr-2">
              <ArrowBigUp />
              {p.score}
              <ArrowBigDown />
            </Button>
            <Button variant="secondary" className="rounded-full mr-2">
              <MessageCircle />
              {p.num_comments}
            </Button>
            <Button variant="secondary" className="rounded-full mr-2">
              <Award />
            </Button>
            <Button variant="secondary" className="rounded-full mr-2">
              <Share />
              Share
            </Button>
          </>
        )}
      </footer>
      {(preview || p.is_crosspost_parent) && (
        <NavLink
          to={p.permalink}
          className={cn(
            "comments absolute inset-0",
            p.is_crosspost_parent ? "z-1" : ""
          )}
        ></NavLink>
      )}
    </article>
  );
  return preview && !p.is_crosspost_parent ? (
    <>
      {article}
      <hr />
    </>
  ) : (
    article
  );
}

export default Post;
