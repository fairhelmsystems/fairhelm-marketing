/**
 * Bun sets `import.meta.main` to true for the entry script. The project does
 * not ship Bun's full type package, so this is the one field the scripts need.
 */
interface ImportMeta {
  readonly main: boolean;
}
