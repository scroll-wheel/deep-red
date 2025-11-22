import { useQuery, useQueries } from "@tanstack/react-query";

import Post from "@/components/Post";

import { useParams } from "react-router";

import { PullPush } from "@/lib/query";

function Top() {
  const params = useParams();

  const year = typeof params.year === "undefined" ? undefined : +params.year;
  const month = typeof params.month === "undefined" ? undefined : +params.month;
  const day = typeof params.day === "undefined" ? undefined : +params.day;

  const valid_year = !(typeof year !== "undefined" && isNaN(year));
  const valid_month = !(typeof month !== "undefined" && isNaN(month));
  const valid_day = !(typeof day !== "undefined" && isNaN(day));

  const postsQuery = useQuery({
    queryKey: ["top", params.subreddit!, year, month, day],
    queryFn:
      valid_year && valid_month && valid_day
        ? PullPush.queryTopPosts(params.subreddit!, year, month, day)
        : () => [],
  });

  useQueries({
    queries: postsQuery.data
      ? postsQuery.data.map((post) => {
          return {
            queryKey: ["post", post.id.toLowerCase()],
            queryFn: () => new Promise((resolve) => resolve(post)),
          };
        })
      : [],
  });

  if (!valid_year) {
    return <div>Invalid year</div>;
  }
  if (!valid_month) {
    return <div>Invalid month</div>;
  }
  if (!valid_day) {
    return <div>Invalid day</div>;
  }

  if (postsQuery.isPending) return "Loading...";

  if (postsQuery.error)
    return "An error has occurred: " + postsQuery.error.message;

  return (
    <ol>
      {postsQuery.data.map((post) => (
        <li key={post.id}>
          <Post data={post} preview={true} show_subreddit={false} />
        </li>
      ))}
    </ol>
  );
}

export default Top;
