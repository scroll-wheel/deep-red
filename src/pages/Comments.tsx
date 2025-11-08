import Post from '@/components/Post';
import Responses from '@/components/Comment';
import { comments, post } from './mock';

function Comments() {
  return (
    <>
      <Post post={post} preview={false} show_subreddit={true} />
      <Responses comments={comments} />
    </>
  );
}

export default Comments;
