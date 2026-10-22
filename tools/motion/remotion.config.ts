/**
 * Build-time render configuration.
 *
 * These compositions are silent explanatory diagrams for the marketing site,
 * not cinema: flat institutional surfaces, no film grain, no gradient churn.
 * That compresses extremely well, which is what keeps every delivered asset
 * inside the page media budget.
 *
 * Note: when the Node.JS APIs are used (scripts/render.ts) this file does not
 * apply — the same options are passed to the API directly.
 */
import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
