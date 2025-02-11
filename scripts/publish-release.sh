#!/bin/sh

set -e

VERSION="$1"
BRANCH="$2"
REPOSITORY="$DOCKER_USERNAME/gitlab-mr-labeler"

echo ""
echo "| P U B L I S H    R E L E A S E"
echo "| Version:    $VERSION"
echo "| Branch:     $BRANCH"
echo "| Repository: $REPOSITORY"
echo ""

echo "Login to docker registry..."
echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin

echo "Build and push docker image..."

if [$BRANCH -eq "main"]
then
  docker buildx build -t "$REPOSITORY:$VERSION" -t "$REPOSITORY:latest" --push .
else
  docker buildx build -t "$REPOSITORY:$BRANCH-$VERSION" -t "$REPOSITORY:$BRANCH" --push .
fi
