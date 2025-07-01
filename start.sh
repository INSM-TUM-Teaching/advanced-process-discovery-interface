#!/bin/bash

echo "Starting Rust APIs..."

(cd activity-relationship-matrix-discovery && cargo run -p api-server) &
(cd automated-process-classification && cargo run -p api-server) &
(cd event-log-to-declare-json && cargo run -p api-server) &

echo "Starting React application..."
(cd apd-integration/apps/apd-ui && npm install && npm run dev) &

wait
