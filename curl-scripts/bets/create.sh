#!/bin/bash

API="http://localhost:4741"
URL_PATH="/bets"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "bet": {
      "date": "'"${DATE}"'",
      "bet_amount": "'"${BET_AMOUNT}"'",
      "bet_description": "'"${BET_DESCRIPTION}"'",
      "bet_result": "'"${BET_RESULT}"'"
    }
  }'

echo
