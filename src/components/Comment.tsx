import { type RedditComment } from '@/arctic-shift/RC';
import { Button } from '@/components/ui/button';

import { useState } from 'react';

import {
  CirclePlus,
  CircleMinus,
  ArrowBigDown,
  ArrowBigUp,
  Award,
  MessageCircle,
  Share,
} from 'lucide-react';

import RFM from '@/components/Markdown';

import { cn, formatDate } from '@/lib/utils';

class NormalizedComment {
  readonly author: string;
  readonly body: string;
  readonly created_utc: Date;
  readonly edited: Date | null;
  readonly id: string;
  readonly is_submitter: boolean;
  readonly parent_id: string;
  readonly score: number;
  // TODO: media
  responses: NormalizedComment[];

  constructor(rc: RedditComment) {
    if (typeof rc.created_utc === 'string' && isNaN(parseInt(rc.created_utc))) {
      throw new Error('created_utc is not a number');
    }

    this.author = rc.author;
    this.body = rc.body;
    this.created_utc = new Date(+rc.created_utc * 1000);
    this.edited =
      typeof rc.edited === 'number' ? new Date(rc.edited * 1000) : null;
    this.id = rc.id;
    this.is_submitter = !!rc.is_submitter;
    this.parent_id = rc.parent_id;
    this.score = rc.score || 0;
    this.responses = [];
  }

  static makeForest(comments: NormalizedComment[]) {
    comments.sort((a, b) => a.created_utc.getTime() - b.created_utc.getTime());

    for (let i = comments.length - 1; i >= 0; i--) {
      if (comments[i].parent_id.startsWith('t3_')) {
        continue;
      }
      for (let j = i - 1; j >= 0; j--) {
        if (comments[i].parent_id.substring(3) === comments[j].id) {
          comments[j].responses.push(comments[i]);
          comments.splice(i, 1);
          break;
        }
      }
      // TODO: What to do about orphans?
    }
  }

  // Sort by:
  // Best, Top, New, Controversial, Old, Q&A
  static sortForest(
    forest: NormalizedComment[],
    compareFn?:
      | ((a: NormalizedComment, b: NormalizedComment) => number)
      | undefined
  ) {
    // Incorrect, there should be a default sort...
    forest.sort(compareFn);
    for (const tree of forest) {
      NormalizedComment.sortForest(tree.responses, compareFn);
    }
  }

  // Search Comments
}

type ResponsesProps = {
  comments: RedditComment[];
  depth: number; // Don't recall makeForest when depth = 1...
};

function Comment(c: NormalizedComment) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="grid grid-rows-[auto_1fr] grid-cols-[auto_1fr]">
      {/* TODO: Make this collapsible more brief */}
      {collapsed ? (
        <CirclePlus className="s-full" onClick={() => setCollapsed(false)} />
      ) : (
        <CircleMinus className="s-full" onClick={() => setCollapsed(true)} />
      )}
      <header className="truncate">
        <span className="font-medium">{c.author}</span>
        {c.is_submitter && <span className="text-primary"> OP</span>}
        <span className="text-muted-foreground">
          {' '}
          · {formatDate(c.created_utc)}
        </span>
      </header>
      <div className="mx-auto border-l-2 border-secondary"></div>
      <div className={cn(collapsed && 'hidden')}>
        <RFM plaintext={c.body} />
        <footer>
          <Button variant="ghost" className="rounded-full">
            <ArrowBigUp />
            {c.score}
            <ArrowBigDown />
          </Button>
          <Button variant="ghost" className="rounded-full">
            <MessageCircle />
            Reply
          </Button>
          <Button variant="ghost" className="rounded-full">
            <Award />
            Award
          </Button>
          <Button variant="ghost" className="rounded-full">
            <Share />
            Share
          </Button>
        </footer>
        {c.responses && Forest(c.responses)}
      </div>
    </div>
  );
}

function Forest(forest: NormalizedComment[]) {
  return forest ? (
    <ul>
      {forest.map((c) => (
        <li key={c.id}>{Comment(c)}</li>
      ))}
    </ul>
  ) : (
    <></>
  );
}

// Renders comments
function Responses({ comments }: ResponsesProps) {
  // Should the caller makeForest? Or should we?
  // makeForst shouldn't be exported...
  const forest = comments.map((rc) => new NormalizedComment(rc));
  NormalizedComment.makeForest(forest);
  NormalizedComment.sortForest(forest, (a, b) => b.score - a.score);
  return Forest(forest);
}

export default Responses;
