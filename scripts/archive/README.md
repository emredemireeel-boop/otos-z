# Archived one-off scripts

84 former repository-root migration, population and patch scripts were moved here on 2026-10-29. They are retained for historical reference and are not part of the build or deployment workflow.

Do not execute them automatically: many assume their former working directory, modify catalog data in bulk, or invoke obsolete indexing workflows. General web pages must not be sent to the Google Indexing API. Current checks live directly in `scripts/`; deployment uses `deploy/release.sh`.
