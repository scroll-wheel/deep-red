import { useQuery, useQueries } from "@tanstack/react-query";

import Post from "@/components/Post";

import { useParams } from "react-router";

import { PullPush } from "@/lib/query";

function Top() {
  const params = useParams();
  // if (typeof params.year !== "undefined" && isNaN(parseInt(params.year))) {
  //   return <div>Invalid year</div>;
  // }
  // if (typeof params.month !== "undefined" && isNaN(parseInt(params.month))) {
  //   return <div>Invalid month</div>;
  // }
  // if (typeof params.day !== "undefined" && isNaN(parseInt(params.day))) {
  //   return <div>Invalid day</div>;
  // }

  const year = typeof params.year === "undefined" ? undefined : +params.year;
  const month = typeof params.month === "undefined" ? undefined : +params.month;
  const day = typeof params.day === "undefined" ? undefined : +params.day;

  const postsQuery = useQuery({
    queryKey: ["top", params.subreddit!, year, month, day],
    queryFn: PullPush.queryTopPosts(params.subreddit!, year, month, day),
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
