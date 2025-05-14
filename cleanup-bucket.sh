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

count=0
BATCH_SIZE=200
jobs_pids=()
aws s3api list-objects-v2 \
  --bucket "$BUCKET_NAME" \
  --prefix "$PREFIX" \
  --query "Contents[?to_string(LastModified) < '$CUTOFF_DATE'].Key" \
  --output text | tr '\t' '\n' |
while IFS= read -r KEY; do
  if [ -n "$KEY" ]; then
    ((count++))
    aws s3 rm "s3://$BUCKET_NAME/$KEY" &
    jobs_pids+=($!)

    if [ $((count % BATCH_SIZE)) -eq 0 ]; then
      echo "Processed $count objects..."
      for pid in "${jobs_pids[@]}"; do
        wait $pid
      done
      jobs_pids=()
      echo "Batch complete, continuing..."
    fi
  fi
done

if [ ${#jobs_pids[@]} -gt 0 ]; then
  echo "Waiting for final batch to complete..."
  for pid in "${jobs_pids[@]}"; do
    wait $pid
  done
  echo "Final batch complete"
fi

echo "Deletion complete"
