#!/bin/bash

# Deploy kabelblick to Synology NAS
# Usage: ./deploy-production.sh [--rebuild]

set -e

# Parse arguments
DOCKER_BUILD_FLAGS=""
if [ "$1" = "--rebuild" ]; then
  DOCKER_BUILD_FLAGS="--no-cache"
  echo "Rebuild mode: Docker cache will be ignored"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load environment variables
if [ -f "$SCRIPT_DIR/.env.production" ]; then
  export $(grep -v '^#' "$SCRIPT_DIR/.env.production" | xargs)
else
  echo "ERROR: .env.production not found"
  echo "Copy .env.production.example to .env.production and configure it"
  exit 1
fi

# Git repository URL
GIT_REPO="https://github.com/achildrenmile/kabelblick.git"

echo "=========================================="
echo "Deploying $CONTAINER_NAME to Synology"
echo "=========================================="

# Step 1: Pull latest changes on Synology
echo ""
echo "[1/3] Pulling latest changes..."
if ssh $SYNOLOGY_HOST "[ -d $REMOTE_DIR/.git ]"; then
  ssh $SYNOLOGY_HOST "cd $REMOTE_DIR && git pull"
else
  echo "Directory does not exist or not a git repo, cloning..."
  ssh $SYNOLOGY_HOST "rm -rf $REMOTE_DIR && git clone $GIT_REPO $REMOTE_DIR"
fi

# Step 2: Build Docker image on Synology
echo ""
echo "[2/3] Building Docker image..."
ssh $SYNOLOGY_HOST "/usr/local/bin/docker build $DOCKER_BUILD_FLAGS -t $IMAGE_NAME $REMOTE_DIR"

# Step 3: Restart container
echo ""
echo "[3/3] Restarting container..."
ssh $SYNOLOGY_HOST "/usr/local/bin/docker stop $CONTAINER_NAME 2>/dev/null || true"
ssh $SYNOLOGY_HOST "/usr/local/bin/docker rm $CONTAINER_NAME 2>/dev/null || true"

ssh $SYNOLOGY_HOST "/usr/local/bin/docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p $CONTAINER_PORT \
  --health-cmd='wget -q -O /dev/null http://localhost:80/health || exit 1' \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  --health-start-period=10s \
  $IMAGE_NAME"

# Verify
echo ""
echo "[Verify] Checking deployment..."
sleep 3

LOCAL_PORT=$(echo $CONTAINER_PORT | cut -d: -f1)
LOCAL_CHECK=$(ssh $SYNOLOGY_HOST "curl -s -o /dev/null -w '%{http_code}' --max-time 5 http://localhost:$LOCAL_PORT/" 2>/dev/null || echo "000")

echo ""
echo "=========================================="
if [ "$LOCAL_CHECK" = "200" ]; then
  echo "Container is running (HTTP $LOCAL_CHECK)"
  echo "Local: http://localhost:$LOCAL_PORT"
  echo ""
  echo "Next: Configure Cloudflare tunnel for $SITE_URL"
else
  echo "WARNING: Container may not be healthy (HTTP $LOCAL_CHECK)"
  echo "Check logs: ssh $SYNOLOGY_HOST '/usr/local/bin/docker logs $CONTAINER_NAME'"
fi
echo "=========================================="
