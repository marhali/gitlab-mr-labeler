# gitlab-mr-labeler

[![semantic-release: conventionalcommits](https://img.shields.io/badge/semantic--release-conventionalcommits-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

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

Assigns labels based on the paths of the changed files. Compares the [git diff](https://git-scm.com/docs/git-diff) between the source and target branch of the
specific merge request.

### Git Log Messages

Assigns labels based on the commit messages of the made changes. Compares the [git log](https://git-scm.com/docs/git-log) between the source and target branch of the specific merge request.

## Installation

## Configuration
