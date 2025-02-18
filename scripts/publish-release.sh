#!/bin/sh

set -e

VERSION="$1"
BRANCH="$2"
REPOSITORY="$DOCKER_USERNAME/gitlab-mr-labeler"

echo ""
echo "| P U B L I S H    R E L E A S E"
echo "| Version:       $VERSION"
echo "| Branch:        $BRANCH"
echo "| Repository:    $REPOSITORY"

if test $BRANCH = "main"
then
  PRIMARY_TAG="$REPOSITORY:$VERSION"
  SECONDARY_TAG="$REPOSITORY:latest"
else
  PRIMARY_TAG="$REPOSITORY:$BRANCH-$VERSION"
  SECONDARY_TAG="$REPOSITORY:$BRANCH"
fi

echo "| Primary Tag:   $PRIMARY_TAG"
echo "| Secondary Tag: $SECONDARY_TAG"
echo ""

echo "Login to docker registry..."
echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin

echo "Build and push docker image..."
docker buildx build --sbom=true --provenance=true --metadata-file "metadata.json" -t "$PRIMARY_TAG" -t "$SECONDARY_TAG" --push .

cat metadata.json
URI=$(jq -r 'repoDigests[0]' metadata.json)
echo "| Build URI:     $URI"

echo "Sign docker image with cosign..."
cosign sign --yes --key env://COSIGN_KEY $URI

echo "Verify docker image..."
docker buildx imagetools inspect $URI
docker pull $URI
cosign verify --key .certs/cosign.pub $URI
