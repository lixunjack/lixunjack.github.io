## The Source File for [Jack Li's Personal Website](https://lixunjack.github.io)

This repository contains the source code for a static website powered by Jekyll and deployed via GitHub Pages. It focuses on the site’s build, configuration, and deployment pipelines—no personal information is duplicated here.

What’s in this repo:
- Jekyll configuration and content (pages, layouts, includes, assets)
- GitHub Actions workflows for continuous integration and deployment
- Documentation for local development, deployment and clean-up
- Method to Clean up old Deployments via GitHub API ('Method_Clean_Deployed_WorkFlow')


### Key files at a glance
- `_config.yml` — Site configuration (root of the repo). Uses `url` with an empty `baseurl` for a user site.
- `.github/workflows/jekyll-gh-pages.yml` — CI/CD workflow that builds and deploys to GitHub Pages
- `.github/workflows/jekyll-docker.yml` — CI workflow that builds the site using Docker for a reproducible environment
- `index.html` — Homepage
- `styles.css` — Site styles


---

#### Credits 

This website is built using Jekyll and hosted on GitHub Pages. Special thanks to the GitHub community for the support and resources!

The above methods are complied with the help by GPT 5 provided by Edinburgh Large-language Model (ELM) at https://elm.edina.ac.uk/
