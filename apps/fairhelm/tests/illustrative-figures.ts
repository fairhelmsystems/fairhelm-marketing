/**
 * Sample figures that appear inside the illustrative UI visuals. They are
 * fine on screen, where the panel is labelled "Illustrative", but must never
 * reach a machine-readable surface where they could be read as a customer
 * result. The build check and the tests assert their absence from every
 * Markdown alternate, llms.txt and llms-full.txt.
 *
 * Keep this in step with the visual components: add a figure here whenever
 * one is added to a demo panel.
 */
export const ILLUSTRATIVE_FIGURES = [
  "98.4%", // home: "Data trust" tile
  "92.8%", // command surface: revenue vs plan
  "+3.4%", // command surface: trend
  "3 accounts past terms", // command surface: overdue receivables
  "68% collected", // AEGIS console: North Campus
  "74% collected", // AEGIS console: Riverside Campus
  "214 families", // AEGIS console
  "2 of 6 campuses", // AEGIS console
  "North Campus",
  "Riverside Campus",
] as const;
