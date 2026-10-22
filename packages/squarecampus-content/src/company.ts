/**
 * Statutory company identity — the single source of truth for every surface
 * that must name the legal entity.
 *
 * Section 12(3) of the Companies Act, 2013 requires a company to publish its
 * name, registered-office address, CIN, telephone number and email on its
 * business letters, billheads and notices. SquareCampus is a product brand;
 * the company behind it is the entity below, and that is what appears in the
 * footer of every page, on the legal pages, and in the Organization JSON-LD.
 *
 * Nothing here is a marketing claim. Change a value only against the MCA
 * record.
 */
export const company = {
  /** Legal name exactly as it appears on the certificate of incorporation. */
  legalName: "FAIRHELM SYSTEMS (OPC) PRIVATE LIMITED",
  /**
   * Title-case rendering for running prose and the copyright line, where the
   * all-caps registry form would read as shouting.
   */
  legalNameDisplay: "Fairhelm Systems (OPC) Private Limited",
  /** Corporate Identity Number allotted by the MCA. */
  cin: "U62099KA2026OPC225579",
  incorporationDate: "2026-08-05",
  incorporationDateDisplay: "5 August 2026",
  incorporationStatus:
    "Incorporated in India on 5 August 2026 under the Companies Act, 2013 · One Person Company",
  /**
   * Goods and Services Tax Identification Number, Karnataka (state code 29),
   * from Form GST REG-06. Required on tax invoices; published so a school's
   * accounts or procurement team can verify it on the GST portal before
   * raising a purchase order. Change only against the GST registration.
   */
  gstin: "29AAHCF1819L1ZA",
  gstinRegistrationDate: "2026-09-22",
  gstinRegistrationDateDisplay: "22 September 2026",
  /** Product brand operated by the company above. */
  brand: "SquareCampus",
  trademarkNotice:
    "SquareCampus™ is a trademark (registration pending) of Fairhelm Systems (OPC) Private Limited.",
  address: {
    full: "No. 33, 4th Floor, 1st Main, Road 3, Ganganagar, R T Nagar, Bangalore North, Bangalore – 560032, Karnataka, India",
    street: "No. 33, 4th Floor, 1st Main, Road 3, Ganganagar, R T Nagar, Bangalore North",
    locality: "Bangalore",
    region: "Karnataka",
    postalCode: "560032",
    country: "IN",
  },
  email: {
    general: "contact@squarecampus.com",
    support: "support@squarecampus.com",
    privacy: "privacy@squarecampus.com",
    press: "press@squarecampus.com",
  },
  /**
   * Statutory contact telephone. Empty until a line is provisioned; every
   * surface that renders it (footer, /contact, Organization JSON-LD) omits
   * the row while it is empty rather than publishing a number that does not
   * ring.
   */
  phone: "" as string,
  /**
   * Grievance channel for Data Principal requests under section 13 of the
   * DPDP Act, 2023. Addressed to the office rather than to an individual.
   */
  grievance: {
    name: "Grievance Officer, Fairhelm Systems (OPC) Private Limited",
    email: "privacy@squarecampus.com",
  },
  jurisdiction: "Bengaluru, Karnataka, India",
} as const;

/** `© 2026 Fairhelm Systems (OPC) Private Limited. All rights reserved.` */
export function copyrightLine(year: number) {
  return `© ${year} ${company.legalNameDisplay}. All rights reserved.`;
}
