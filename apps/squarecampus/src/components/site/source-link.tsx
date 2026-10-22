import { siteSource } from "@/content/site-content";

const githubMark =
  "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.775.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";

/**
 * "This site is open source" — a footer link to the website's repository.
 *
 * The footer is on every page, so this stays server-rendered with a CSS-only
 * tooltip: a floating-UI tooltip would ship its positioning engine to every
 * visitor for one hover note. The label is visible text, so touch and
 * screen-reader users get the message; the note is exposed as the link's
 * description and appears on hover or keyboard focus.
 */
export function SourceLink() {
  return (
    <span className="group/source relative inline-flex self-start sm:self-auto">
      <a
        href={siteSource.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby="site-source-note"
        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface)] px-3 py-1.5 text-xs text-[color:var(--muted-foreground)] transition-[color,border-color,box-shadow] hover:border-[color:var(--cite-neon)]/60 hover:text-[color:var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)] dark:hover:shadow-[0_0_18px_-4px_var(--cite-neon)]"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5" fill="currentColor">
          <path d={githubMark} />
        </svg>
        {siteSource.label}
        <span
          aria-hidden
          className="size-1.5 rounded-full bg-[color:var(--cite-neon)] transition-transform group-hover/source:scale-125 dark:shadow-[0_0_8px_var(--cite-neon)]"
        />
      </a>
      <span
        id="site-source-note"
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-50 w-[17rem] -translate-x-1/2 translate-y-1 rounded-[0.9rem] border border-[color:var(--line-strong)] bg-background px-3.5 py-2.5 text-xs leading-5 text-[color:var(--foreground)] opacity-0 shadow-[0_18px_44px_rgba(8,15,30,0.18)] transition-[opacity,transform] duration-150 group-focus-within/source:translate-y-0 group-focus-within/source:opacity-100 group-hover/source:translate-y-0 group-hover/source:opacity-100 motion-reduce:transition-none dark:border-[color:var(--cite-neon)]/35 dark:shadow-[0_0_28px_-10px_var(--cite-neon),0_18px_44px_rgba(0,0,0,0.5)]"
      >
        {siteSource.tooltip}
      </span>
    </span>
  );
}
