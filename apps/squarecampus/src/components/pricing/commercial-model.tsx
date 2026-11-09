import { planIds, pricingPolicy } from "@fairhelm/squarecampus-content/pricing";
import { formatInr } from "@/lib/pricing-estimate";

export function CommercialModel() {
  return (
    <div className="pricing-rate-card" id="model">
      <h3 className="type-card-title">The published student rates.</h3>
      <p>
        INR per student per year, billed annually. Minimum 100 students per billed subscription.
        Prices exclude applicable GST.
      </p>
      <section className="pricing-rate-table-wrap" aria-label="Progressive annual student rates">
        <table>
          <caption className="sr-only">
            SquareCampus progressive annual rates in INR. Each rate applies only to students in that
            slab.
          </caption>
          <thead>
            <tr>
              <th scope="col">Enrolment slab</th>
              {planIds.map((plan) => (
                <th scope="col" key={plan}>
                  {pricingPolicy.plans[plan].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pricingPolicy.studentSlabs.map((slab, index) => (
              <tr key={slab.upTo ?? "beyond"}>
                <th scope="row">
                  {index === 0 ? "First 1,000" : index === 1 ? "Next 4,000" : "Beyond 5,000"}
                </th>
                {planIds.map((plan) => (
                  <td key={plan} data-label={pricingPolicy.plans[plan].name}>
                    {formatInr(slab.ratesPaise[plan])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <p id="volume">
        Only students inside the cheaper slab get its rate. The first 1,000 keep their original rate
        when student 1,001 joins. Growth is reconciled through the agreed true-up; reductions are
        normally considered at renewal.
      </p>
      <a className="pricing-policy-link" href="/pricing-policy.json">
        Read the versioned pricing policy
      </a>
    </div>
  );
}
