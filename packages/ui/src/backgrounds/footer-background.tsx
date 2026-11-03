/**
 * Decorative footer treatment shared by the marketing applications: a hairline
 * at the top edge and the same faint ledger rule the page is printed on. The
 * two blurred colour orbs that used to sit here were removed: `blur-3xl` on
 * large layers is one of the costliest things a low-end phone can paint, and
 * they added nothing a visitor reads.
 */
export function FooterBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 top-0 h-px bg-[color:var(--line-strong)]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--paper-rule) 1px, transparent 1px), linear-gradient(90deg, var(--paper-rule) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(180deg, black, transparent 86%)",
        }}
      />
    </div>
  );
}
