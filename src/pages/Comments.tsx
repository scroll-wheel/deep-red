import { useQuery } from "@tanstack/react-query";

import Post from "@/components/Post";
import Responses from "@/components/Comment";
import { useParams } from "react-router";

import { ArcticShift } from "@/lib/query";

import Empty from "@/pages/Empty";

function Comments() {
  const linkId = useParams().id;

  const postQuery = useQuery({
    queryKey: ["post", linkId?.toLowerCase()],
    queryFn: ArcticShift.queryPost(linkId!),
  });

  const commentsQuery = useQuery({
    queryKey: ["comments", linkId?.toLowerCase()],
    queryFn: ArcticShift.queryComments(linkId!),
  });

  if (postQuery.isPending) return "Loading...";

  if (postQuery.error)
    return "An error has occurred: " + postQuery.error.message;

  if (commentsQuery.isPending) return "Loading...";

  if (commentsQuery.error)
    return "An error has occurred: " + commentsQuery.error.message;

  if (postQuery.data === null) {
    return (
      <Empty title="Page Not Found" subtitle="Explore Reddit Communities" />
    );
  }

  return (
    <>
      <Post data={postQuery.data} preview={false} show_subreddit={true} />
      <Responses data={commentsQuery.data} />
    </>
  );
}

export default Comments;
