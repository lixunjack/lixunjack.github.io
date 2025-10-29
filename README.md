## The Source File for [Jack Li's Personal Website](https://lixunjack.github.io)

This repository contains the source code for a static website powered by Jekyll and deployed via GitHub Pages. It focuses on the site’s build, configuration, and deployment pipelines—no personal information is duplicated here.

What’s in this repo:
- Jekyll configuration and content (pages, layouts, includes, assets)
- GitHub Actions workflows for continuous integration and deployment
- Documentation for local development, deployment and clean-up

Guides included:
 - Clean up old Deployments via GitHub API
 - Delete GitHub Actions workflow runs
 - Windows cmd examples using GitHub CLI (gh)



### Key files at a glance
- `_config.yml` — Site configuration (root of the repo). Uses `url` with an empty `baseurl` for a user site.
- `.github/workflows/jekyll-gh-pages.yml` — CI/CD workflow that builds and deploys to GitHub Pages
- `.github/workflows/jekyll-docker.yml` — CI workflow that builds the site using Docker for a reproducible environment
- `index.html` — Homepage
- `styles.css` — Site styles


### Method to Clean the Culprit Workflows

_Inspired from [GitHub Housekeeping: Remove Unwanted Deployments in Minutes](https://dhanushkac.medium.com/github-housekeeping-remove-unwanted-deployments-in-minutes-a57a52969eb2)_

---

## Prerequisites

1. **Install GitHub CLI:**
   - Follow the instructions on the [GitHub CLI official website](https://cli.github.com/) to install the CLI.

2. **Install Git (Windows Command Line):**
   - Open your Command Prompt and run:
     ```batch
     winget install -e --id Git.Git
     ```
   - After installing Git, exit the terminal by running:
     ```batch
     exit
     ```

---

## Windows Command Prompt (cmd.exe) Examples Using `gh`

> **Note:** Run these commands directly in a cmd window.  
> If you paste these into a `.bat` file, **double the `%` signs** inside the `for` loop.

---

### 1. Set the Repository and List Deployment IDs

Set your repository (update the value accordingly) and list all deployment IDs:
 ```batch
:: Set your repository
set REPO=lixunjack/lixunjack.github.io

:: List all deployment IDs for the specified repository
gh api -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" ^
  /repos/%REPO%/deployments --paginate --jq ".[].id"

:: To restrict the list to only GitHub Pages deployments:

gh api -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" ^
  /repos/%REPO%/deployments --paginate --jq "map(select(.environment==\"github-pages\"))[].id"
 ```

---

### 2. Delete All Deployments (Interactive)

This loop will inactivate each deployment first, then delete it:
 
 ```batch
:: Set your repository
set REPO=lixunjack/lixunjack.github.io

:: Loop through each deployment ID, inactivate it, then delete it
for /f %i in ('gh api -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/%REPO%/deployments --paginate --jq ".[].id"') do (
  echo Inactivating %i...
  gh api --method POST -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/%REPO%/deployments/%i/statuses -f state=inactive >NUL 2>&1
  echo Deleting %i...
  gh api --method DELETE -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/%REPO%/deployments/%i
)
 ```

---

### 3. Delete Only GitHub Pages Deployments

Limit the actions to deployments where the environment is github-pages:

```batch
for /f %i in ('gh api -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/%REPO%/deployments --paginate --jq "map(select(.environment==\"github-pages\"))[].id"') do (
  echo Inactivating %i...
  gh api --method POST -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/%REPO%/deployments/%i/statuses -f state=inactive >NUL 2>&1
  echo Deleting %i...
  gh api --method DELETE -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/%REPO%/deployments/%i)
```

---

### 4. Delete a Specific Deployment by ID

If you know the deployment ID to delete, inactivate then delete it with these commands:

```batch
:: Set your repository and deployment ID
set REPO=lixunjack/lixunjack.github.io
set ID=3217088726

:: Inactivate the specified deployment
gh api --method POST -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/%REPO%/deployments/%ID%/statuses -f state=inactive

:: Delete the specified deployment
gh api --method DELETE -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/%REPO%/deployments/%ID%
```

---

### 5. Clean up GitHub Actions workflow runs


```batch

:: Preview run IDs for a specific workflow file:

gh api --paginate "/repos/lixunjack/lixunjack.github.io/actions/workflows/jekyll-gh-pages.yml/runs?per_page=100" -q ".workflow_runs[].id"

:: Delete all runs for that workflow (e.g., jekyll-gh-pages.yml):


for /f "delims=" %i in ('gh api --paginate "/repos/lixunjack/lixunjack.github.io/actions/workflows/jekyll-gh-pages.yml/runs?per_page=100" -q ".workflow_runs[].id"') do gh api --method DELETE /repos/lixunjack/lixunjack.github.io/actions/runs/%i

:: Repeat for the Docker workflow (jekyll-docker.yml):

for /f "delims=" %i in ('gh api --paginate "/repos/lixunjack/lixunjack.github.io/actions/workflows/jekyll-docker.yml/runs?per_page=100" -q ".workflow_runs[].id"') do gh api --method DELETE /repos/lixunjack/lixunjack.github.io/actions/runs/%i

```

---



### Additional Tips

- Make sure you’re authenticated: gh auth status (use gh auth login if needed). gh auth status or gh auth login
- You need repo admin or write permissions to manage deployments.
- The list endpoint returns an array, so the jq ".[].id" expression is appropriate. If you ever fetch a single deployment (endpoint /deployments/), manage it with the “single ID” commands above.


---

#### Credits 

This website is built using Jekyll and hosted on GitHub Pages. Special thanks to the GitHub community for the support and resources!

The above command lines are coded by GPT 5 provided by Edinburgh Large-language Model (ELM) at https://elm.edina.ac.uk/
