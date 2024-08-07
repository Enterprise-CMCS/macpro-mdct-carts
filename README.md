# Note: this is an archive of CARTS v2 (former `master` branch). See `main` for the current CARTS v3

[![Maintainability](https://api.codeclimate.com/v1/badges/ccc447a00640e708538b/maintainability)](https://codeclimate.com/repos/6102dd981f91b059fd002f56/maintainability)

# cms-carts-seds

## Architecture

![Architecture Diagram](./.images/architecture.svg?raw=true)

## Required Tools

You will need [Node](https://nodejs.org/en/) and to make things easier you should have [NVM](https://github.com/nvm-sh/nvm) installed

This project uses [Yarn](https://yarnpkg.com/) as a package manager. Make sure to install it globally. No not use npm or commit any package-lock files

You will need docker installed. either with [homebrew](https://brew.sh/) or may we suggest the [docker desktop](https://hub.docker.com/editions/community/docker-ce-desktop-mac)

You will need [serverless](https://www.serverless.com/) installed globally. `npm install -g serverless`

## Environments

The `master` branch reflects our latest product. On merge to `master`, the dev environment is deployed and tested in Amazon. When the `master` build succeeds, the commit on `master` is tagged in git as a candidate release version.

There are three primary environments

- Production - [https://mdctcarts.cms.gov/](https://mdctcarts.cms.gov/)
- Val (staging) - [https://mdctcartsval.cms.gov/](https://mdctcartsval.cms.gov/)
- Dev - [https://mdctcartsdev.cms.gov/](https://mdctcartsdev.cms.gov/)

## Continuous Integration and Deployment

Jenkins is used to deploy the various releasses from master into their respective environments

- [http://internal-jenkins-cartsseds-1894071124.us-east-1.elb.amazonaws.com/](http://internal-jenkins-cartsseds-1894071124.us-east-1.elb.amazonaws.com/)

When a version needs to be deployed to staging or production select the desired pipeline and choose `deploy with parameters` inserting the release number you wish to deploy.

## Some development notes

Development will be done on feature/bugfix branches that will be submitted as PRs. Accepted PRs will be merged to the `master` branch.

A PR must be reviewed and approved by someone other than the submitter. The submitting developer is responsible for merging it to `master` once the PR has been approved and all comments have been resolved.

This project uses [Prettier](https://prettier.io/) for code formatting. Uee format_on_save functionality or run `npx prettier --write /path/to/file` on your files before submitting your PR

## Set up

1. Clone this repository
1. Navigate to the cloned repository
   - `cd cms-carts-seds`
1. Ensure you are in the `master` branch

## Start Up Localhost with Django/Postgres Backend

1. Navigate to the 'frontend' subfolder
   - `cd frontend`
1. Connect a container to the network (only necessary on first build)
   - `docker network create data_net`
1. Build your services

- `docker-compose -f docker-compose.local.yml down -v --rmi local`
- `docker-compose -f docker-compose.local.yml up -d`

_This will run in the console and then a few things happen in the background. There is a roughly a two minute time period from when the command completes and the ui is available to see the status you can do `docker-compose -f docker-compose.local.yml logs`_

1. Access the project

- Visit the react frontend at http://localhost:81
- Visit the Django api at http://localhost:8000
- The local postgres db is available at localhost:5432

## Available Endpoints:

- `/api/v1/sections/<int:year>/<str:state>`: all the sections for a year and state, e.g. `/api/v1/sections/2020/ak`.
- `/api/v1/sections/<int:year>/<str:state>/<int:section>`: the section for that year and state, e.g. `/api/v1/sections/2020/ak/1`.
- `/api/v1/sections/<int:year>/<str:state>/<int:section>/<str:subsection>`: the subsection for that year and state, e.g. `/api/v1/sections/2020/az/3/c`.
- `/api/v1/questions/<str:state>/<slug:id>`: e.g. `/api/v1/questions/ma/2020-03-c-01-01`.
- `/api/v1/generic-sections/<int:year>`: all the default sections for a year e.g. `/api/v1/generic-sections/2020`.
- `/api/v1/generic-sections/<int:year>/<int:section>`: the default section for that year e.g. `/api/v1/generic-sections/2020/1`.
- `/api/v1/generic-sections/<int:year>/<int:section>/<str:subsection>`: the default subsection for that year e.g. `/api/v1/generic-sections/2020/1/a`.
- `/api/v1/generic-questions/<slug:id>`: the default corresponding question, e.g. `/api/v1/generic-questions/2020-01-a-01`.

Currently only Sections 1, 2, 3 (incomplete) and 5 are available, and only mock data for AK, AZ, and MA is available.

Append `?format=json` to the URLs to get bare JSON.

## Available Routes:

- `/sections/:year/:sectionOrdinal/:subsectionMarker` e.g. `http://localhost:81/sections/2020/3/c`
- `/sections/:year/:sectionOrdinal/` e.g. `http://localhost:81/sections/2020/3`

### Running the React Test Suite

1. Navigate to the front end
   1. `cd frontend\react\src`
2. Launch the test runner in interactive watch mode.
   1. Run `npm test`
   2. Press `a` to run all tests.
