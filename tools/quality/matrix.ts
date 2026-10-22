/** Production exports, served through the real edge handler. No remote targets. */
export const sites = [
  {
    name: "squarecampus",
    origin: "http://localhost:3100",
    canonical: "https://squarecampus.com",
    routes: ["/", "/platform/", "/pricing/", "/demo/", "/about/"],
    drawerRoute: "/",
  },
  {
    name: "fairhelm",
    origin: "http://localhost:3102",
    canonical: "https://fairhelmsystems.com",
    routes: ["/", "/services/data-engineering/", "/squarecampus/", "/contact/", "/about/"],
    drawerRoute: "/",
  },
  {
    name: "blogs",
    origin: "http://localhost:3101",
    canonical: "https://blogs.squarecampus.com",
    routes: ["/", "/fairhelm/", "/attendance-early-warning-system/", "/fairhelm/the-kpi-contract/"],
    drawerRoute: null,
  },
  {
    name: "legal",
    origin: "http://localhost:3103",
    canonical: "https://legal.fairhelmsystems.com",
    routes: [
      "/",
      "/squarecampus/privacy-policy/",
      "/squarecampus/data-retention/",
      "/fairhelm/terms/",
    ],
    drawerRoute: null,
  },
  {
    name: "press",
    origin: "http://localhost:3104",
    canonical: "https://press.fairhelmsystems.com",
    routes: ["/", "/squarecampus/"],
    drawerRoute: null,
  },
] as const;

export const viewports = [
  { name: "phone-360", width: 360, height: 800, touch: true },
  { name: "phone-390", width: 390, height: 844, touch: true },
  { name: "tablet-768", width: 768, height: 1024, touch: true },
  { name: "desktop-1024", width: 1024, height: 768, touch: false },
  { name: "desktop-1440", width: 1440, height: 900, touch: false },
] as const;
