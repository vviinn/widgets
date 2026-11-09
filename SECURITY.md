# Security Policy

## Supported versions

**Only the latest version published to npm receives security fixes.** Releases are frequent and
follow [semantic versioning](https://docs.npmjs.com/about-semantic-versioning); if you are
pinned to an older version, please upgrade before reporting.

## Software bill of materials

Releases from 2.229.0 on carry a [CycloneDX](https://cyclonedx.org/) SBOM of the packages
the bundle contains. It ships in the npm package as `dist/sbom.cdx.json`, so a pinned version
has its own, e.g. `https://cdn.jsdelivr.net/npm/vviinn-widgets@<version>/dist/sbom.cdx.json`,
and each [GitHub release](https://github.com/vviinn/widgets/releases) attaches the same file.

## Reporting a vulnerability

**Please do not report security issues in public issues, pull requests or discussions.**

Report privately through GitHub:

1. Open the [Security tab](https://github.com/vviinn/widgets/security) of this repository.
2. Click **Report a vulnerability**, or go straight to
   [the reporting form](https://github.com/vviinn/widgets/security/advisories/new).

This creates a private advisory visible only to you and the maintainers.

Please include:

- the affected component and package version,
- a description of the issue and its impact,
- steps to reproduce, with a minimal snippet or page if possible,
- any proof-of-concept you have.

We will acknowledge your report, keep you informed while we investigate, and credit you in
the advisory when a fix is published — unless you prefer to stay anonymous.

## What is not a vulnerability

The **read-only site token** is public by design. It is embedded in your storefront's HTML
so the widgets can call the vviinn API from the browser, and anyone viewing the page can
read it. A token being visible in page source, in a bundle or in a network request is
therefore expected behaviour, not a disclosure. The same applies to the demo tokens used in
the public Storybook.

If you believe a read-only token grants more access than reading catalogue data for its own
site, that *is* worth reporting — please do.

## Scope

This policy covers the `vviinn-widgets` package and the code in this repository. For issues
in the vviinn API, the merchant panel or your account, contact
[support@vviinn.com](mailto:support@vviinn.com).
