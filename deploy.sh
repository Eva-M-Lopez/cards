#!/bin/bash
set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting deployment to Digital Ocean...${NC}"

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    echo -e "${RED}❌ Error: docker-compose.prod.yml not found!${NC}"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo "Please create a .env file with your environment variables."
    echo "You can use .env.example as a template."
    exit 1
fi

# Pull latest code
echo -e "${YELLOW}📥 Pulling latest code from Git...${NC}"
git pull origin main

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker compose -f docker-compose.prod.yml down

# Remove old images (optional - uncomment if you want to always use fresh builds)
# echo -e "${YELLOW}🗑️  Removing old images...${NC}"
# docker compose -f docker-compose.prod.yml down --rmi all

# Build and start containers
echo -e "${YELLOW}🏗️  Building and starting containers...${NC}"
docker compose -f docker-compose.prod.yml up -d --build

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 10

# Check container status
echo -e "${YELLOW}🔍 Checking container status...${NC}"
docker compose -f docker-compose.prod.yml ps

# Show logs
echo -e "${YELLOW}📋 Recent logs:${NC}"
docker compose -f docker-compose.prod.yml logs --tail=50

# Test backend health
echo -e "${YELLOW}🏥 Testing backend health...${NC}"
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is healthy!${NC}"
else
    echo -e "${RED}⚠️  Warning: Backend health check failed${NC}"
fi

# Clean up unused Docker resources
echo -e "${YELLOW}🧹 Cleaning up unused Docker resources...${NC}"
docker system prune -f

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🌐 Your application should be available at:${NC}"
echo -e "${GREEN}   http://$(curl -s ifconfig.me)${NC}"
echo ""
echo -e "${YELLOW}📝 Useful commands:${NC}"
echo "  View logs:       docker compose -f docker-compose.prod.yml logs -f"
echo "  Restart:         docker compose -f docker-compose.prod.yml restart"
echo "  Stop:            docker compose -f docker-compose.prod.yml down"
echo "  Check status:    docker compose -f docker-compose.prod.yml ps"
