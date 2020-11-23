## cms-carts-seds

18F/CMS CARTS &amp; SEDS redevelopment

# Some development approach notes

Development will be done on feature/bugfix branches that will be submitted as PRs. Accepted PRs will be merged to the `master` branch. The `master` branch reflects our latest product. On merge to `master`, the dev environment is deployed and tested in Amazon. When the `master` build succeeds, the commit on `master` is tagged in git as a candidate release version.

Downstream/higher environments are deployed by running the appropriate job and specifying a version (AKA tag, AKA release) when prompted.

The events that trigger downstream environments, and the number and names of downstream environments, is entirely flexible.

Currently, there is a staging environment and a prod environment.
On master build success, the staging job is automatically deployed with the latest release.
Prod is not automatically triggered, but is instead released ad hoc as warranted by the business. The release is affected by starting the prod job and specifying the desired version when prompted.

A PR must be reviewed and approved by someone other than the submitter. When the reviewer(s) accept the PR, they are responsible for merging it to `master`. However, the submitter is still responsible if that merge causes anything to go wrong.

Remember: Run `npx prettier --write /path/to/file` on your files before submitting your PR!

## Users and role/state assignments

The user info comes from Okta/EUA, and that info doesn't include user roles in this application or what state(s) a user is associated with.

On the frontend, `/state_assoc`, `/role_user_assoc`, and `/role_jobcode_assoc` allow for uploading CSVs that can associate states to usernames, roles to usernames, and roles to job codes.

For the initial set up of users in PROD, as a result of limited user management capabilities, role associations and the initial user base will need to be imported from csv files. The following csv files from the docs folder should be imported to the public database:

1. role_jobcode_assoc.csv should be imported to public.carts_api_rolesfromjobcode
2. user_role_assoc.csv should be imported to public.carts_api_rolefromusername
3. user_state_assoc.csv should be imported to public.carts_api_statesfromusername

To associate users to states, the most convenient process is most likely: (this is currently not operational)

1. Assign `state_user` to a job code via `/role_jobcode_assoc` (don't use `CARTS_Group_Dev` for this, though).
2. Assign a user who has whatever job code you associated with `state_user` in step one to `state_user` in `/role_user_assoc` using their EUA ID as their username.
3. Assign that user a state (or, if they're a `co_user`, a list of states) using `/state_assoc`.

`/profile` will show you what info Okta provides about your user; `/userinfo` will show you what our info our backend provides about your user.

## Usage

1. Run `git config --global core.autocrlf input` to set line endings throughout
2. Clone this repository
3. Ensure you are in the `master` branch
4. Navigate into the cloned repository in a terminal
   1. `cd cms-carts-seds`
5. Navigate into the 'frontend' subfolder
   1. `cd frontend`
6. Run the deploy.sh script, or run the deployDev.sh script on linux. The deploy script will deploy the application as it would deploy in production, the static content being compiled and served from an nginx container. The deployDev script will deploy the application more suitable for development, on a node container with src files mounted to it; this enables live reloading of the application when src files are changed.
   1. Use `.\deploy.bat` or `.\deployDev.bat` on Windows
7. Visit the react frontend at http://localhost:81 Visit the Django api at http://localhost:8000 The local postgres db is available at localhost:5432. The api and db are currently hello world, and are not deploying meaningful code; they can likely be entirely ignored. They are incorporated into the deployment with an eye to the future.

## Start Up Localhost with Django/Postgres Backend

1. Navigate to the cloned repository in a terminal
   1. `cd cms-carts-seds`
2. Navigate to the 'frontend' subfolder
   1. `cd frontend`
   2. `docker network create data_net` (should only be necessary on first build)`
3. Run `docker-compose -f docker-compose.dev.yml down`
4. Run `docker-compose -f docker-compose.dev.yml up --build`
5. In another terminal window:
   1. ~~(Should no longer be necessary For Linux: run `local-additional.sh`)~~
   2. For Windows: run `docker-compose -f docker-compose.dev.yml run api_postgres sh -c "python manage.py makemigrations && python manage.py migrate && python manage.py generate_fixtures"`
6. Available Endpoints:

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

7. Available Routes:
   - `/sections/:year/:sectionOrdinal/:subsectionMarker` e.g. `http://localhost:81/sections/2020/3/c`
   - `/sections/:year/:sectionOrdinal/` e.g. `http://localhost:81/sections/2020/3`
8. Okta authentication: add `?dev=dev-ak` to the URL in order to bypass the Okta authentication and view the application as a fake user from Alaska; `dev-az` and `dev-ma` are also supported values for the `dev` parameter that will provide fake users for those states.

### Running the React Test Suite

1. Navigate to the front end
   1. `cd frontend\react\src`
2. Launch the test runner in interactive watch mode.
   1. Run `npm test`
   2. Press `a` to run all tests.
