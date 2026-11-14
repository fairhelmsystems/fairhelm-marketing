import { foundingProgramme } from "./commercial";

export const FOUNDING_PARTNER_DEMO_HREF = "/launch-partners/#request-diagnosis";
export const foundingPartners = {
  href: foundingProgramme.href,
  home: {
    eyebrow: "Founding Institutional Pilot",
    heading: "Start with SquareCampus this academic year.",
    lead: `${foundingProgramme.nature} Use generally available standard capabilities within your agreed scope.`,
    ctaNote: "Renew at standard annual pricing or leave without a compulsory subscription.",
  },
} as const;
