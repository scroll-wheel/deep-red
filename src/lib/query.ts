import { type RedditPost } from "@/arctic-shift/RS";
import { type RedditComment } from "@/arctic-shift/RC";

// type QueryPost = (linkId: string) => () => Promise<RedditPost | null>;
// type QueryComments = (linkId: string) => () => Promise<RedditComment[]>;

// type QueryTopPosts = (
//   subreddit: string,
//   year?: number,
//   month?: number,
//   day?: number
// ) => () => Promise<RedditPost[]>;

type CommentWrapper = {
  kind: "t1";
  data: RedditComment;
};

type Replies = {
  kind: "Listing";
  data: {
    dist: 0;
    children: CommentWrapper[];
  };
};

export class ArcticShift {
  static readonly base = "https://arctic-shift.photon-reddit.com";

  static queryPost(linkId: string): () => Promise<RedditPost | null> {
    return () =>
      fetch(new URL(`/api/posts/ids?ids=${linkId}`, ArcticShift.base))
        .then((res) => res.json())
        .then((json) => (json.data.length !== 0 ? json.data[0] : null));
  }

  static queryCommentsAlt(linkId: string): () => Promise<RedditComment[]> {
    return () =>
      fetch(
        new URL(
          `/api/comments/search?limit=auto&link_id=${linkId}`,
          ArcticShift.base
        )
      )
        .then((res) => res.json())
        .then((json) => json.data); // {kind: "t1", data: RedditComment}[]
  }

  static queryComments(linkId: string): () => Promise<RedditComment[]> {
    return () =>
      fetch(
        new URL(
          `/api/comments/tree?limit=25000&link_id=${linkId}`,
          ArcticShift.base
        )
      )
        .then((res) => res.json())
        .then((json) => ArcticShift.flattenTree(json.data));
  }

  static flattenTree(replies: CommentWrapper[]): RedditComment[] {
    const result = [];
    for (const comment of replies) {
      result.push(comment.data);
      if (comment.data.replies) {
        result.push(
          ...ArcticShift.flattenTree(comment.data.replies.data.children)
        );
      }
    }
    return result;
  }
}

export class PullPush {
  static readonly base = "https://api.pullpush.io";

  static queryPost(linkId: string): () => Promise<RedditPost | null> {
    return () =>
      fetch(new URL(`/reddit/search/submission/?ids=${linkId}`, PullPush.base))
        .then((res) => res.json())
        .then((json) => (json.data.length !== 0 ? json.data[0] : null));
  }

  static queryComments(linkId: string): () => Promise<RedditComment[]> {
    return () =>
      fetch(new URL(`/reddit/search/comment/?link_id=${linkId}`, PullPush.base))
        .then((res) => res.json())
        .then((json) => json.data)
        // Hack
        .then((data) =>
          JSON.parse(JSON.stringify(data).replaceAll("&amp;", "&"))
        );
  }

  static queryTopPosts(
    subreddit: string,
    year?: number,
    month?: number,
    day?: number
  ): () => Promise<RedditPost[]> {
    let extra = "";
    if (year) {
      let after = new Date(Date.UTC(year, 0));
      let before = new Date(Date.UTC(year + 1, 0));

      if (month) {
        after = new Date(Date.UTC(year, month - 1));
        before = new Date(Date.UTC(year, month));

        if (day) {
          after = new Date(Date.UTC(year, month - 1, day));
          before = new Date(Date.UTC(year, month - 1, day + 1));
        }
      }

      extra = `&after=${+after / 1000}&before=${+before / 1000}`;
    }

    return () =>
      fetch(
        new URL(
          `/reddit/search/submission?sort_type=score&subreddit=${subreddit}` +
            extra,
          PullPush.base
        )
      )
        .then((res) => res.json())
        .then((json) => json.data)
        // Hack
        .then((data) =>
          JSON.parse(JSON.stringify(data).replaceAll("&amp;", "&"))
        );
  }
}
