@echo off
setlocal

echo Starting Rust APIs...

start "activity-relationship-matrix-discovery" cmd /k "cd activity-relationship-matrix-discovery && cargo run -p api-server"
start "automated-process-classification" cmd /k "cd automated-process-classification && cargo run -p api-server"
start "event-log-to-declare-json" cmd /k "cd event-log-to-declare-json && cargo run -p api-server"

echo Starting React application...

cd apd-integration\apps\apd-ui
start "React App (apd-ui)" cmd /k "npm install && npm run dev"

endlocal
