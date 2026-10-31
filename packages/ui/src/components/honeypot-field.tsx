import type { ComponentProps } from "react";

/**
 * A decoy input for form-filling bots. It is moved off-screen rather than
 * `display: none`, because many bots skip fields that are not rendered. The
 * `name` is a plausible one for scripts that fill by name; real visitors never
 * reach it (aria-hidden, out of the tab order, autofill disabled).
 */
export function HoneypotField(props: Omit<ComponentProps<"input">, "type" | "tabIndex" | "style">) {
  return (
    <input
      name="company_website"
      autoComplete="off"
      placeholder="Company website"
      {...props}
      type="text"
      tabIndex={-1}
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-10000px",
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  );
}
