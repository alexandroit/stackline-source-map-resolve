# Issue Triage

## Historical parser limitation

The upstream discussion about false-positive source-map directives is relevant
but not a compatibility-safe parser rewrite for 1.0.0. This release documents
and regression-tests the existing language-agnostic matcher. A future parser
change requires fixtures for JavaScript and CSS strings, block and line
comments, multiple directives, browser differences, minified inputs, and a
versioned compatibility decision.

## Windows drive letters

Loss of a drive designator is corrected narrowly before URL resolution. Report
regressions with the code path, map path, source path, process drive, expected
reader arguments, and actual reader arguments. UNC/network URLs and POSIX paths
remain in the baseline differential lane.

## Security reports

Potential vulnerabilities follow `SECURITY.md`; do not open a public issue
before the maintainers have had a reasonable opportunity to assess a report.
