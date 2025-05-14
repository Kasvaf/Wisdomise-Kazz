#!/bin/bash

# Set your bucket name
BUCKET_NAME=$1
# Set prefix (folder) if needed, or leave as "" for entire bucket
PREFIX=""
# Number of days to consider as "old"
DAYS_OLD=7


# Detect OS and set cutoff date accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS uses -v flag
    CUTOFF_DATE=$(date -v-${DAYS_OLD}d +"%Y-%m-%d")
else
    # Linux uses -d flag
    CUTOFF_DATE=$(date -d "${DAYS_OLD} days ago" +"%Y-%m-%d")
fi

echo "Removing files older than $CUTOFF_DATE from s3://$BUCKET_NAME/$PREFIX"

# List objects and filter by date
aws s3api list-objects-v2 --bucket "$BUCKET_NAME" --prefix "$PREFIX" --query "Contents[?to_string(LastModified) < '$CUTOFF_DATE'].Key" --output text |
while read -r KEY; do
    if [ -n "$KEY" ]; then
        echo "Deleting s3://$BUCKET_NAME/$KEY"
        aws s3 rm "s3://$BUCKET_NAME/$KEY"
    fi
done

echo "Deletion complete"
