#!/bin/sh
tmux new-session -d "npm run serve"
tmux split-window -h "cd ../sachet-server; source .venv/bin/activate.fish; flask --debug --app sachet.server run"
