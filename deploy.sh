#!/bin/bash

PORT=2010

echo "🔁 Killing any process using port $PORT..."
PID=$(lsof -ti tcp:$PORT)
if [ -n "$PID" ]; then
    echo "Found process on port $PORT: PID $PID. Killing..."
    kill -9 $PID
else
    echo "No process found on port $PORT."
fi

echo "🔁 Reloading Nginx service..."
sudo systemctl stop nginx
sleep 2
sudo systemctl start nginx

echo "🔐 Configuring firewall rules..."

# UFW
if command -v ufw >/dev/null 2>&1; then
    echo "📌 UFW detected..."
    sudo ufw allow $PORT/tcp
    sudo ufw allow 'Nginx Full'
    sudo ufw reload
fi

# firewalld
if systemctl is-active --quiet firewalld; then
    echo "📌 firewalld detected..."
    sudo firewall-cmd --permanent --add-port=$PORT/tcp
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --reload
fi

echo "🚀 Starting your app..."

# Replace this with your actual app start command and path
cd /path/to/your/app || exit
nohup npm start > app.log 2>&1 &

echo "✅ Deployment complete. Port $PORT is open and app started."
