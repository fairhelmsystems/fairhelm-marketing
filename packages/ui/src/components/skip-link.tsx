/** Keyboard shortcut to the page's main landmark; visible only while focused. */
export function SkipLink({
  target = "main-content",
  label = "Skip to content",
}: {
  target?: string;
  label?: string;
}) {
  return (
    <a
      href={`#${target}`}
      className="fixed top-3 left-3 z-50 -translate-y-20 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:translate-y-0"
    >
      {label}
    </a>
  );
}
