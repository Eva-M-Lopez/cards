#!/bin/bash
echo "🚀 Deploying to Digital Ocean..."

# Pull latest code
git pull origin main

# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
npm run build
cd ..

# Restart services
pm2 restart cards-backend
systemctl restart nginx

echo "✅ Deployment complete!"
echo "🌐 Visit: http://68.183.171.109"
