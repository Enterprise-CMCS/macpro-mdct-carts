#!/usr/bin/env bash
set -euo pipefail

stage="${1:-}"
if [[ "$stage" != "val" && "$stage" != "production" ]]; then
  echo "Expected stage val or production, got: $stage" >&2
  exit 1
fi

function_name="carts-bigmac-streams-${stage}-sinkEnrollmentCounts"
mappings=$(aws lambda list-event-source-mappings \
  --function-name "$function_name" --output json --no-cli-pager)

report=$(jq -er '
  if (.EventSourceMappings | type) != "array" then
    error("AWS response does not contain an EventSourceMappings array")
  else
    [.EventSourceMappings[] | select(.SelfManagedEventSource != null)] |
    if length == 0 then
      "No self-managed Kafka event source mappings found."
    else
      [ .[] | select(.State != "Enabled") |
        "Mapping \(.UUID // "unknown"): \(.State // "unknown") (\(.StateTransitionReason // "no reason provided"))"
      ] | join("\n")
    end
  end
' <<< "$mappings")

if [[ -z "$report" ]]; then
  echo "All Kafka event source mappings for $function_name are enabled."
  exit 0
fi

echo "Kafka trigger alert for $function_name:"
echo "$report"
if [[ -z "${SLACK_WEBHOOK_SECURITY:-}" ]]; then
  echo "SLACK_WEBHOOK_SECURITY is required to send the alert." >&2
  exit 1
fi

payload=$(jq -n --arg text "Kafka trigger alert for ${function_name} (${stage}):"$'\n'"${report}" '{text: $text}')
response=$(curl --fail --silent --show-error \
  --header 'Content-type: application/json' \
  --data "$payload" "$SLACK_WEBHOOK_SECURITY")
if [[ "$response" != "ok" ]]; then
  echo "Slack webhook returned an unexpected response: $response" >&2
  exit 1
fi
