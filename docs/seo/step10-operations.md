# SEO operations

## Checks before deployment

1. `npx tsc --noEmit`
2. `npm run build`
3. `npm run seo:check` starts a local production server if necessary, checks status cases, all sitemap URLs against robots/canonical/noindex, server JSON-LD, metadata duplicates and all internal HTML links. Any failed stage exits nonzero. Reports: `docs/seo/ci/latest/`.
4. Server release: `PM2_APP=<existing-app-name> bash deploy/release.sh`. This follows the existing npm/Next/PM2 workflow; no previous deployment script was present (only a maintenance cron file). A separate `.next-candidate-*` build runs on port 3011 and must pass `npm run seo:check` before that PM2 application restarts. Existing build directories are retained; do not remove a directory used by PM2. `OTOSOZ_DIST_DIR` selects the candidate at runtime.
5. After release, rerun the checks with `--base https://otosoz.com`. In a rollback, restart the same PM2 application with its previous `OTOSOZ_DIST_DIR` and `--update-env`. The release script does not edit Cloudflare configuration.

## Weekly Search Console report

`npm run seo:weekly -- --site sc-domain:otosoz.com --key /etc/otosoz/search-console.json`

The script requests only `https://www.googleapis.com/auth/webmasters.readonly` and calls `searchanalytics.query` plus `urlInspection.index.inspect`. The last complete seven-day period ends three days before the report date; prior-week totals and 50 critical URL inspection results are saved to `docs/seo/weekly/YYYY-WW.json`. Missing/denied API data is recorded as unavailable, never as fabricated zero traffic. Failed reports exit 1. Inspection is of Google's indexed version, not a live indexing request.

The initial run returned HTTP 403: enable Search Console API in Google Cloud project `244436311966`, then grant the service account access to the Search Console property. The account's email can be read locally from the credential's `client_email`; never publish its private key. Use `deploy/otosoz-seo-weekly.cron` after configuring the actual credential path. This cron is provided for installation; it is not installed by local testing.

Source: [Google URL Inspection API](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect), [Search Analytics query](https://developers.google.com/webmaster-tools/v1/searchanalytics/query).

## Search Console and Bing manual work

1. Once released, submit `https://otosoz.com/sitemap.xml` under Sitemaps. Confirm the 11 child maps load; retain `/news-sitemap.xml` for the latest 48 hours of eligible news.
2. Use the approved `pilot20-20261029.md` list to select important URLs for URL Inspection → Request indexing **after** the URL is 200, indexable and self-canonical. Source-review candidates that remain noindex must first meet the quality gate; do not request their indexing merely because they appear in the pilot.
3. Weekly, record clicks/impressions/position and Page indexing counts for soft 404, Crawled – currently not indexed, duplicate/canonical and server errors. Compare with deployment dates. Inspect representative affected URLs before changing quality rules.
4. Verify the property in Bing Webmaster Tools (or import the verified Search Console property), submit the sitemap and inspect key pages. IndexNow may notify Bing/Yandex of genuine added/updated/deleted URLs, using a domain-hosted key. Configure that separately; no IndexNow request or general-page Google Indexing API call is made by these scripts. Notifications do not guarantee indexing.

Sources: [Google URL Inspection tool](https://support.google.com/webmasters/answer/9012289), [Bing IndexNow setup](https://www.bing.com/indexnow/getstarted).

## Open-market source collection

For each province without a verified market: record the municipality/operator page or dated official announcement, exact venue/address, operating day and hours, publication date, scope and any closure/move notice. Prefer the current municipality/operator over an undated directory. Save the source URL and the actual check date with the market record. If sources conflict or the operating program cannot be verified, keep `needs-confirmation`/`historical`, leave uncertain fields empty, retain noindex and exclude it from the sitemap. Recheck the evidence before changing status to `verified`; require a second editorial check of the venue and schedule. Source content, not the date of a build, determines freshness.

## Content pilot

The user approved the 20-page list on 2026-10-29. It ranks historical click/impression opportunities, including source-review candidates that currently remain noindex. Cluster opportunity tables and the raw-data limitations are in `content-priorities-20261029.json`. The pilot template and official-source collection must be used before any new indexable claims are added.
