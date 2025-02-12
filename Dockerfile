# Base on leightweight node alpine image
FROM node:22.13.1-alpine

# Provide git cli as interface to project repository
RUN apk add --no-cache git

# Copy build artifacts
WORKDIR /app
COPY dist .

# Provide gitlab-mr-labeler CLI tool
COPY scripts/gitlab-mr-labeler.cli.sh /usr/local/bin/gitlab-mr-labeler
RUN chmod +x /usr/local/bin/gitlab-mr-labeler
