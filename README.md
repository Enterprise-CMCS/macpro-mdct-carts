## cms-carts-seds
18F/CMS CARTS &amp; SEDS redevelopment

# Some development approach notes
Development will be done on feature/bugfix branches that will be submitted as PRs. Accepted PRs will be merged to the `develop` branch. The `develop` branch will be merged to the `master` branch when we feel a release is justified.

Changes to `develop` will cause `develop` to be deployed to a dev/test/similar environment when we have that running.

Changes to `master` will cause `master` to be deployed to production when we have that running.

A PR must be reviewed by someone other than the submitter. When the reviewer(s) accept the PR, they are responsible for merging it to `develop`. However, the submitter is still responsible if that merge causes anything to go wrong.
