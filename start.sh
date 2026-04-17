#!/bin/sh

echo "Starting backend..."
cd /app/backend
npm start &

echo "Starting frontend..."
cd /app/edusync-next
npm start &

echo "Starting NGINX..."
nginx -g 'daemon off;'
