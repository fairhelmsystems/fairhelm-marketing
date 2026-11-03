const themeScript = `
(() => {
  const storageKey = "fairhelm-marketing-theme";

  // Scripting is on: only now may entrance animations start content hidden.
  // Without this class (no JS) every revealed section renders visible.
  document.documentElement.classList.add("js");

  try {
    const saved = localStorage.getItem(storageKey);
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const theme = saved === "dark" || saved === "light" ? saved : "dark";
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme || preferred;
  } catch (error) {
    document.documentElement.classList.add("dark");
    document.documentElement.dataset.theme = "dark";
  }
})();
`;

export function ThemeScript() {
  return (
    <script
      id="fairhelm-marketing-theme-script"
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}
