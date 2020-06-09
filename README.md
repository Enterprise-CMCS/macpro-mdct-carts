## cms-carts-seds

18F/CMS CARTS &amp; SEDS redevelopment

# Some development approach notes
Development will be done on feature/bugfix branches that will be submitted as PRs. Accepted PRs will be merged to the `master` branch.  The master branch reflects our latest product.  On merge to master, the dev environment is deployed and tested in Amazon.  When the master build succeeds, the commit on master is tagged in git as a candidate release version.

Downstream/higher environments are deployed by running the appropriate job and specifying a version (AKA tag, AKA release) when prompted.

The events that trigger downstream environments, and the number and names of downstream environments, is entirely flexible.

Currently, there is a staging environment and a prod environment.
On master build success, the staging job is automatically deployed with the latest release.
Prod is not automatically triggered, but is instead released ad hoc as warranted by the business.  The release is affected by starting the prod job and specifying the desired version when prompted.

A PR must be reviewed by someone other than the submitter. When the reviewer(s) accept the PR, they are responsible for merging it to `master`. However, the submitter is still responsible if that merge causes anything to go wrong.

## Usage
1. Clone this repository
2. Navigate into the cloned repository in a terminal
    1. `cd cms-carts-seds`
3. Navigate into the 'app' subfolder
    1. `cd app`
4. Run the deploy.sh script, or run the deployDev.sh script.  The deploy script will deploy the application as it would deploy in production, the static content being compiled and served from an nginx container.  The deployDev script will deploy the application more suitable for development, on a node container with src files mounted to it; this enables live reloading of the application when src files are changed.
    1. `sh deploy.sh` or `sh deployDev.sh`
5. Visit the react frontend at http://localhost  Visit the Django api at http://localhost:8000  The local postgres db is available at localhost:5432.  The api and db are currently hello world, and are not deploying meaningful code; they can likely be entirely ignored.  They are incorporated into the deployment with an eye to the future.
