import policy from "@fairhelm/squarecampus-content/pricing-policy.json";

export const dynamic = "force-static";

export function GET() {
  return Response.json(policy);
}
