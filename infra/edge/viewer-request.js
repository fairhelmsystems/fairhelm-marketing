/** CloudFront Functions runtime 2.0, viewer-request. No build step or imports. */
function handler(event) {
  var request = event.request;
  var host = request.headers.host.value.toLowerCase();
  // Keep relative Location headers on this origin, including unusual incoming paths.
  var uri = request.uri.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
  var blogs = "https://blogs.squarecampus.com";
  var legal = "https://legal.fairhelmsystems.com";
  var press = "https://press.fairhelmsystems.com";

  // CloudFront exposes already-encoded query keys/values. Preserve duplicates.
  function query() {
    var parts = [];
    var values = request.querystring || {};
    Object.keys(values).forEach(function (key) {
      var entries = values[key].multiValue || [values[key]];
      entries.forEach(function (entry) {
        parts.push(key + "=" + entry.value);
      });
    });
    return parts.length ? "?" + parts.join("&") : "";
  }
  function redirect(location) {
    return {
      statusCode: 301,
      statusDescription: "Moved Permanently",
      headers: {
        location: { value: location + query() },
        "cache-control": { value: "public, max-age=3600" },
      },
    };
  }
  function pagePath(path) {
    if (!path || path === "/") return "/";
    return /\.[^/]+$/.test(path) || path.endsWith("/") ? path : path + "/";
  }

  var isBlog = host === "blogs.squarecampus.com";
  var isBlogAlias = host === "blogs.fairhelmsystems.com" || host === "blog.fairhelmsystems.com";
  var isSquareCampus =
    host === "squarecampus.com" ||
    host === "www.squarecampus.com" ||
    host === "squarecampus.in" ||
    host === "www.squarecampus.in";
  var isFairhelm = host === "fairhelmsystems.com" || host === "www.fairhelmsystems.com" || host === "fairhelmsystems.in" || host === "www.fairhelmsystems.in";
  var blogPath = /^\/blogs?(?=\/|$)/;
  var productPolicies = ["privacy-policy","terms-of-service","data-processing-addendum","data-retention","acceptable-use","ai-policy","refund-policy","competitor-notice"];
  var companyPolicies = ["legal","privacy","terms","acceptable-use","ai-policy","data-processing","refund-policy"];
  var parts = uri.split("/").filter(function(part) {return part.length;});
  var documentRoute = parts.length === 1 || (parts.length === 2 && parts[1] === "index.md");
  if (isSquareCampus && documentRoute && productPolicies.indexOf(parts[0]) !== -1)
    return redirect(legal + "/squarecampus" + pagePath(uri));
  if (isFairhelm && documentRoute && companyPolicies.indexOf(parts[0]) !== -1)
    return redirect(legal + (parts[0] === "legal" ? "/fairhelm/" : "/fairhelm" + pagePath(uri)));
  if ((isSquareCampus || isFairhelm) && /^\/press\/?$/.test(uri))
    return redirect(press + (isSquareCampus ? "/squarecampus/" : "/"));


  var isInsightRoute = !/\.[^/]+$/.test(uri) || /\/(?:feed\.xml|index\.md)$/.test(uri);
  if ((isFairhelm || isBlogAlias || isBlog) && isInsightRoute && /^\/insights(?=\/|$)/.test(uri)) {
    var insight = uri.replace(/^\/insights/, "");
    return redirect(
      blogs + (insight === "/feed.xml" ? "/feed.xml" : pagePath("/fairhelm" + insight))
    );
  }

  // Move old article paths directly to their final URL, before slash/domain rules.
  if ((isSquareCampus || isFairhelm || isBlog || isBlogAlias) && blogPath.test(uri)) {
    return redirect(blogs + pagePath(uri.replace(blogPath, "")));
  }
  if (isBlogAlias) return redirect(blogs + pagePath(uri));

  // Existing SquareCampus aliases retain their non-blog destinations.
  var legacy = {
    "/features": "/platform/",
    "/product": "/platform/",
    "/how-it-works": "/rollout/",
    "/why-different": "/why-squarecampus/",
    "/contact-us": "/demo/",
  };
  var legacyTarget = isSquareCampus && legacy[uri.replace(/\/+$/, "")];
  if (legacyTarget) return redirect("https://squarecampus.com" + legacyTarget);
  if (isSquareCampus && host !== "squarecampus.com")
    return redirect("https://squarecampus.com" + pagePath(uri));
  if (isFairhelm && host !== "fairhelmsystems.com")
    return redirect("https://fairhelmsystems.com" + pagePath(uri));

  if (uri !== request.uri) return redirect(pagePath(uri));

  // Canonical route slash, then an internal rewrite for private S3 origins.
  // Files (including Next's .txt payloads and feeds) bypass both operations.
  if (!/\.[^/]+$/.test(uri)) {
    if (!uri.endsWith("/")) return redirect(uri + "/");
    request.uri = uri + "index.html";
  }
  return request;
}
