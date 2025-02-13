# gitlab-mr-labeler

[![Github Release](https://img.shields.io/github/v/release/marhali/gitlab-mr-labeler?style=for-the-badge)](https://github.com/marhali/gitlab-mr-labeler/releases)
[![Github Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/marhali/gitlab-mr-labeler/build.yml?style=for-the-badge)](https://github.com/marhali/gitlab-mr-labeler/actions)
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

## Installation

Just set up a new job in your `.gitlab-ci.yml` and use the predefined docker image.
You need to provide a project access token and a relative path to your json configuration file.
After that you can just call the `gitlab-mr-labeler` CLI and pass the access token and relative path as command-line arguments.

```yaml
# .gitlab-ci.yml

gitlab_mr_labeler:
  image: docker.io/marhali/gitlab-mr-labeler:latest
  script: gitlab-mr-labeler $MY_PROJECT_ACCESS_TOKEN .github/gitlab-mr-labeler.config.json
```

## Configuration

In order to configure which labels should you need to provide a json configuration file.

- **assignMethod**: Can be either `APPEND` or `OVERRIDE`
- **gitLogMessages**: Object of label keys and a array value of regex strings
- **gitDiffPaths**: Object of label keys and a array value of regex strings

```json5
// gitlab-mr-labeler.config.json

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
