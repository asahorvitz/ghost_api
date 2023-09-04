#! /bin/sh

until flask run --host 0.0.0.0; do
    echo "Ghost backend crashed with exit code $?.  Respawning.." >&2
    sleep 1
done