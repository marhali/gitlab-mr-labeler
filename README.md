# gitlab-mr-labeler

[![Github Release](https://img.shields.io/github/v/release/marhali/gitlab-mr-labeler?style=for-the-badge)](https://github.com/marhali/gitlab-mr-labeler/releases)
[![Github Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/marhali/gitlab-mr-labeler/build.yml?style=for-the-badge)](https://github.com/marhali/gitlab-mr-labeler/actions)
![Codecov](https://img.shields.io/codecov/c/github/marhali/gitlab-mr-labeler?style=for-the-badge)
[![Docker Stars](https://img.shields.io/docker/stars/marhali/gitlab-mr-labeler?style=for-the-badge)](https://hub.docker.com/r/marhali/gitlab-mr-labeler)
[![Docker Pulls](https://img.shields.io/docker/pulls/marhali/gitlab-mr-labeler?style=for-the-badge)](https://hub.docker.com/r/marhali/gitlab-mr-labeler)
[![Docker Image Version](https://img.shields.io/docker/v/marhali/gitlab-mr-labeler?sort=semver&style=for-the-badge&label=Image%20Version)](https://hub.docker.com/r/marhali/gitlab-mr-labeler/tags)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg?style=for-the-badge)](https://paypal.me/marhalide)

Solves the problem of missing automation of labeling
[merge requests](https://docs.gitlab.com/ee/user/project/merge_requests/) in [GitLab](https://about.gitlab.com/). Based
on [merge request pipelines](https://docs.gitlab.com/ee/ci/pipelines/merge_request_pipelines.html), labels are
automatically assigned using various configuration options.

## Features

- Dedicated [JSON](https://de.wikipedia.org/wiki/JSON) configuration file to configure all your labels
- Supports regular expressions ([RegExp](https://regex101.com/)) to match the suitable labels
- Label assignment method can be either `APPEND` or `OVERRIDE`
- Only uses the official [GitLab API](https://docs.gitlab.com/ee/api/merge_requests.html#update-mr)
- Works efficiently and saves resources (fast & lightweight)
- Supports any GitLab instance (On-Premise & Cloud)

## Builtin variants

The following configuration variants are currently supported.

### Git Diff Paths

Assigns labels based on the paths of the changed files.
Compares the [git diff](https://git-scm.com/docs/git-diff) between the source and target branch of the
specific merge request.

### Git Log Messages

Assigns labels based on the commit messages of the made changes.
Compares the [git log](https://git-scm.com/docs/git-log) between the source and target branch of the specific merge request.

## Usage

### Getting started

In order to use **gitlab-mr-labeler** you must follow these steps:

1. Create a [Project Access Token](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) in GitLab
2. Add a dedicated JSON configuration file
3. Configure a [CI](https://docs.gitlab.com/ee/ci/) job that runs on every merge request

You need ~ 7 minutes to get your initial setup up and running 🚀.

### Create a Project Access Token in GitLab

This tool needs a PAT in order to be able to assign labels on merge requests. Just follow the steps as described in the GitLab documentation.
See [Create a project access token](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html#create-a-project-access-token).

Make sure to set the following variables:
- **Select a role**: `REPORTER` (any other role should be sufficient as well)
- **Select scopes**: `api`

Add your newly created token as an CI/CD variable. See [Define a CI/CD variable in the UI](https://docs.gitlab.com/ee/ci/variables/#for-a-project).

### Add a dedicated JSON configuration file

In order to configure which labels should be applied you need to provide a json configuration file.
You can place the configuration file anywhere in your project repository. This file will be referenced when the **gitlab-mr-labeler** CLI is called.

You must define the following properties. If you want to disable any label matcher just set the equivalent property to an empty object (`{}`).

- **assignMethod**: Can be either `APPEND` or `OVERRIDE`
- **gitLogMessages**: Object of label keys and an array value of matchable regex strings
- **gitDiffPaths**: Object of label keys and an array value of matchable regex strings

```json5
// .gitlab/gitlab-mr-labeler.config.json

{
  "assignMethod": "APPEND",
  "gitLogMessages": {
    "feature": ["^feat"]
  },
  "gitDiffPaths": {
    "dependencies": ["package.json$"]
  }
}
```

Check out the predefined [examples](examples) to find a good starting point to label your merge requests 🔥.

### Configure a CI job that runs on every merge request

To automatically determine and assign the appropriate labels you need to define a merge request pipeline job that executes the **gitlab-mr-labeler** CLI
with your created project access token and the relative path to your json configuration file.

```yaml
# .gitlab-ci.yml

stages:
  - prepare

gitlab_mr_labeler:
  stage: prepare
  image: docker.io/marhali/gitlab-mr-labeler:latest
  script: gitlab-mr-labeler $MY_PROCESS_ACCESS_TOKEN .gitlab/gitlab-mr-labeler.config.json
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
```

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## Contact

Marcel Haßlinger - [@marhali_de](https://twitter.com/marhali_de) - [Portfolio Website](https://marhali.de)

Project Link: [https://github.com/marhali/gitlab-mr-labeler](https://github.com/marhali/gitlab-mr-labeler)

## Donation

If this tool helps you to reduce development time, you can give me a [cup of coffee](https://paypal.me/marhalide) :)
