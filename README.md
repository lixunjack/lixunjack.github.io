## The Source File for [Jack Li's Personal Website](https://lixunjack.github.io)

This repository contains the source code for a static website powered by Jekyll and deployed via GitHub Pages. It focuses on the site’s build, configuration, and deployment pipelines—no personal information is duplicated here.

What’s in this repo
- Jekyll configuration and content (pages, layouts, includes, assets)
- GitHub Actions workflows for continuous integration and deployment
- Documentation for local development and deployment

### Key files at a glance
- `_config.yml` — Site configuration (root of the repo). Uses `url` with an empty `baseurl` for a user site.
- `.github/workflows/jekyll-gh-pages.yml` — CI/CD workflow that builds and deploys to GitHub Pages
- `.github/workflows/jekyll-docker.yml` — CI workflow that builds the site using Docker for a reproducible environment
- `index.html` — Homepage
- `styles.css` — Site styles


### Method to clean the culprit workflows:
#### inspired from GitHub Housekeeping: Remove Unwanted Deployments in Minutes (https://dhanushkac.medium.com/github-housekeeping-remove-unwanted-deployments-in-minutes-a57a52969eb2):

- FIRST INSTALL First you need to install GitHub CLI. Go to the official website of GH CLI and download instructions will be there., IN THIS PROCESS ON A WINDOW COMMAND LINE, ONE SHOULD INSTALL GIT BY THE COMMAND: 

- open your cmd prompt and run this:

winget install -e --id Git.Git

- then run:

exit


- Here are Windows Command Prompt (cmd.exe) versions using gh. They list all deployment IDs and delete them by first marking each inactive.

- Note: Run these directly in a cmd window. If you put them in a .bat file, double the % signs inside the FOR loop (examples provided).

- Set the repo and preview IDs In cmd:

set REPO=lixunjack/lixunjack.github.io

gh api -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" ^
  /repos/%REPO%/deployments --paginate --jq ".[].id"

    To restrict to GitHub Pages deployments only:

gh api -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" ^
  /repos/%REPO%/deployments --paginate --jq "map(select(.environment==\"github-pages\"))[].id"

    Delete all deployments (cmd, interactive) This loop inactivates first, then deletes.

set REPO=lixunjack/lixunjack.github.io

for /f %i in ('gh api -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/%REPO%/deployments --paginate --jq ".[].id"') do (
  echo Inactivating %i...
  gh api --method POST -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/%REPO%/deployments/%i/statuses -f state=inactive >NUL 2>&1
  echo Deleting %i...
  gh api --method DELETE -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/%REPO%/deployments/%i
)

- Same, but only for environment=github-pages:

for /f %i in ('gh api -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/%REPO%/deployments --paginate --jq "map(select(.environment==\"github-pages\"))[].id"') do (
  echo Inactivating %i...
  gh api --method POST -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/%REPO%/deployments/%i/statuses -f state=inactive >NUL 2>&1
  echo Deleting %i...
  gh api --method DELETE -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/%REPO%/deployments/%i
)

- Delete a single known deployment ID (cmd)

set REPO=lixunjack/lixunjack.github.io
set ID=3217088726

gh api --method POST -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/%REPO%/deployments/%ID%/statuses -f state=inactive
gh api --method DELETE -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/%REPO%/deployments/%ID%


- Tips

    - Make sure you’re authenticated: gh auth status (use gh auth login if needed).
    - You need repo admin or write permissions to manage deployments.
    - The list endpoint returns an array, so the jq ".[].id" expression is appropriate. If you ever fetch a single deployment (endpoint /deployments/), manage it with the “single ID” commands above.




#### Credits 

This website is built using Jekyll and hosted on GitHub Pages. Special thanks to the GitHub community for the support and resources!


