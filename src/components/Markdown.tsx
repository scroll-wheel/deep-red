import Markdown from 'react-markdown';

function RFM({ plaintext }: { plaintext: string }) {
  return <Markdown>{plaintext}</Markdown>;
}

export default RFM;
