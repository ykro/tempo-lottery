#!/bin/bash

# Configuration
PROJECT_ID="caramel-banner-478016-t5"
SERVICE_NAME="tempo-lottery"
REGION="us-central1"

# Check if user is logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
    echo "Error: No active gcloud account. Please run 'gcloud auth login' first."
    exit 1
fi

echo "Using active gcloud configuration..."
gcloud config set project "$PROJECT_ID"

echo "Deploying to Cloud Run..."
# Using source deploy which builds remotely via Cloud Build (Buildpacks)
# --allow-unauthenticated: Makes the service public
gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --region "$REGION" \
    --allow-unauthenticated \
    --project "$PROJECT_ID"

echo "Deployment command sent!"
