#!/bin/bash

# Configuration
PROJECT_ID="caramel-banner-478016-t5"
SERVICE_NAME="tempo-lottery"
REGION="us-central1"
KEY_FILE=".gcp/caramel-banner-478016-t5-dff93277df43.json"

# Check if key file exists
if [ ! -f "$KEY_FILE" ]; then
    echo "Error: Key file not found at $KEY_FILE"
    exit 1
fi

echo "Authenticating with Google Cloud..."
gcloud auth activate-service-account --key-file="$KEY_FILE"
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
