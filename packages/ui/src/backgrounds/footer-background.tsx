/** Decorative footer treatment shared by the marketing applications. */
export function FooterBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--line-strong)] to-transparent" />
      <div className="absolute left-[-8rem] top-14 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(83,117,194,0.1),transparent_68%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(83,117,194,0.14),transparent_70%)]" />
      <div className="absolute bottom-[-8rem] right-[-5rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(74,153,142,0.08),transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(74,153,142,0.12),transparent_72%)]" />
      <div
        className="absolute inset-0 opacity-[0.18] dark:opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(91,111,140,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(91,111,140,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.8), transparent 86%)",
        }}
      />
    </div>
  );
}
