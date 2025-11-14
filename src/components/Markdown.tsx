import Markdown from "react-markdown";

import { cn } from "@/lib/utils";

function RFM({ plaintext }: { plaintext: string }) {
  const commonClasses = "my-4 first:mt-[inherit] last:mb-[inherit]";
  const codeClasses = "rounded-sm p-1 bg-secondary";
  const headingClasses = "scroll-m-20 font-semibold tracking-tight";
  const listClasses = "ml-6";

  return (
    <div>
      <Markdown
        children={plaintext}
        components={{
          a(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return <a className={cn(className, commonClasses)} {...rest} />;
          },
          blockquote(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return (
              <blockquote
                className={cn(
                  className,
                  commonClasses,
                  "background-secondary border-l-[calc(var(--spacing))] pl-4 italic"
                )}
                {...rest}
              />
            );
          },
          code(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return <code className={cn(className, codeClasses)} {...rest} />;
          },
          em(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return <em className={cn(className, commonClasses)} {...rest} />;
          },
          h1(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return (
              <h1
                className={cn(
                  className,
                  commonClasses,
                  headingClasses,
                  "text-2xl"
                )}
                {...rest}
              />
            );
          },
          h2(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return (
              <h2
                className={cn(
                  className,
                  commonClasses,
                  headingClasses,
                  "text-xl"
                )}
                {...rest}
              />
            );
          },
          h3(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return (
              <h3
                className={cn(
                  className,
                  commonClasses,
                  headingClasses,
                  "text-lg"
                )}
                {...rest}
              />
            );
          },
          h4(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return (
              <h4
                className={cn(
                  className,
                  commonClasses,
                  headingClasses,
                  "text-base"
                )}
                {...rest}
              />
            );
          },
          h5(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return (
              <h5
                className={cn(
                  className,
                  commonClasses,
                  headingClasses,
                  "text-sm"
                )}
                {...rest}
              />
            );
          },
          h6(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return (
              <h6
                className={cn(
                  className,
                  commonClasses,
                  headingClasses,
                  "text-xs"
                )}
                {...rest}
              />
            );
          },
          hr(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return <hr className={cn(className, commonClasses)} {...rest} />;
          },
          img(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return <img className={cn(className, commonClasses)} {...rest} />;
          },
          li(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return <li className={cn(className, commonClasses)} {...rest} />;
          },
          ol(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return (
              <ol
                className={cn(
                  className,
                  commonClasses,
                  listClasses,
                  "list-decimal"
                )}
                {...rest}
              />
            );
          },
          p(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return <p className={cn(className, commonClasses)} {...rest} />;
          },
          pre(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return (
              <pre
                className={cn(className, commonClasses, codeClasses)}
                {...rest}
              />
            );
          },
          strong(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return (
              <strong className={cn(className, commonClasses)} {...rest} />
            );
          },
          ul(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { node, className, ...rest } = props;
            return (
              <ul
                className={cn(
                  className,
                  commonClasses,
                  listClasses,
                  "list-disc"
                )}
                {...rest}
              />
            );
          },
        }}
      ></Markdown>
    </div>
  );
}

export default RFM;
