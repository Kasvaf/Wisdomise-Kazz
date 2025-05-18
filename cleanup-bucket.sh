#!/bin/bash

BUCKET_NAME=$1
DAYS_OLD=7
BATCH_SIZE=1000  # AWS allows up to 1000 objects per delete operation

# Detect OS and set cutoff date accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS uses -v flag
    CUTOFF_DATE=$(date -v-${DAYS_OLD}d +"%Y-%m-%d")
else
    # Linux uses -d flag
    CUTOFF_DATE=$(date -d "${DAYS_OLD} days ago" +"%Y-%m-%d")
fi

echo "Removing files older than $CUTOFF_DATE from s3://$BUCKET_NAME"

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
echo $TEMP_DIR
trap 'rm -rf "$TEMP_DIR"' EXIT

# List all keys that are older than the cutoff date
echo "Listing objects to delete..."
aws s3api list-objects-v2 \
  --bucket "$BUCKET_NAME" \
  --query "Contents[?to_string(LastModified) < '$CUTOFF_DATE'].Key" \
  --output text | tr '\t' '\n' > "$TEMP_DIR/keys.txt"

# Count the total number of objects to delete
TOTAL_OBJECTS=$(wc -l < "$TEMP_DIR/keys.txt")
echo "Found $TOTAL_OBJECTS objects to delete"

if [ "$TOTAL_OBJECTS" -eq 0 ]; then
    echo "No objects to delete"
    exit 0
fi

# Process in batches
BATCH_COUNT=0
DELETED_COUNT=0

# Split the file into batches
split -l "$BATCH_SIZE" "$TEMP_DIR/keys.txt" "$TEMP_DIR/batch_"

# Process each batch file
for BATCH_FILE in "$TEMP_DIR"/batch_*; do
    BATCH_COUNT=$((BATCH_COUNT+1))
    BATCH_SIZE=$(wc -l < "$BATCH_FILE")
    JSON_FILE="$TEMP_DIR/delete_$BATCH_COUNT.json"

    # Create proper JSON structure
    echo '{"Objects": [' > "$JSON_FILE"

    # Process each line and create a valid JSON entry
    LINE_COUNT=0
    while IFS= read -r KEY; do
        LINE_COUNT=$((LINE_COUNT+1))
        # Properly escape the key
        ESCAPED_KEY=$(echo "$KEY" | sed 's/"/\\"/g')
        echo "  {\"Key\": \"$ESCAPED_KEY\"}" >> "$JSON_FILE"

        # Add comma if not the last line
        if [ "$LINE_COUNT" -lt "$BATCH_SIZE" ]; then
            echo "," >> "$JSON_FILE"
        fi
    done < "$BATCH_FILE"

    echo '], "Quiet": true}' >> "$JSON_FILE"

    echo "Deleting batch $BATCH_COUNT ($BATCH_SIZE objects)..."
    aws s3api delete-objects --bucket "$BUCKET_NAME" --delete "file://$JSON_FILE"

    DELETED_COUNT=$((DELETED_COUNT + BATCH_SIZE))
    echo "Progress: $DELETED_COUNT / $TOTAL_OBJECTS objects deleted ($(($DELETED_COUNT * 100 / $TOTAL_OBJECTS))%)"
done

echo "Deletion complete. Removed $DELETED_COUNT objects from s3://$BUCKET_NAME"
