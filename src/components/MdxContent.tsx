import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

const components: MDXRemoteProps["components"] = {
  h1: (props) => <h1 className="mt-8 text-2xl font-semibold text-white/95 md:text-3xl" {...props} />,
  h2: (props) => <h2 className="mt-8 text-xl font-semibold text-white/90 md:text-2xl" {...props} />,
  h3: (props) => <h3 className="mt-6 text-lg font-semibold text-white/90" {...props} />,
  p: (props) => <p className="mt-4 text-sm leading-7 text-white/75 md:text-base" {...props} />,
  a: (props) => <a className="link" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/75 md:text-base" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-white/75 md:text-base" {...props} />,
  li: (props) => <li className="leading-7" {...props} />,
  blockquote: (props) => (
    <blockquote className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75" {...props} />
  ),
  code: (props) => (
    <code className="rounded bg-white/5 px-1.5 py-0.5 text-[0.9em] text-white/85" {...props} />
  ),
  pre: (props) => (
    <pre className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/85" {...props} />
  )
};

export function MdxContent({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm]
        }
      }}
      components={components}
    />
  );
}


