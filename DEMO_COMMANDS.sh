#!/bin/bash

# ==========================================
# DSA DRYRUN - MENTOR DEMO COMMAND SEQUENCE
# ==========================================
# Copy and paste each command one at a time
# ==========================================

echo "📌 STEP 1: Navigate to project"
cd /home/shreesh-kolhatkar/Documents/DDR/DSA-Dryrunner

echo "📌 STEP 2: Start Docker containers"
sudo docker-compose up -d

echo "📌 STEP 3: Wait 15 seconds for services to start..."
sleep 15

echo "📌 STEP 4: Check all containers are UP"
sudo docker-compose ps

echo "📌 STEP 5: Seed database with 10 problems"
sudo docker exec dsa-dryrunner_server_1 npm run seed

echo "📌 STEP 6: Verify backend API"
curl -s http://localhost:3001/api/problems | jq '.data | length'

echo ""
echo "✅ SETUP COMPLETE!"
echo ""
echo "Now open in browser:"
echo "👉 http://localhost:5173"
echo ""
echo "Test the Run Code feature:"
echo "1. Click 'Two Sum'"
echo "2. Paste this code:"
echo ""
echo "function twoSum(nums, target) {"
echo "    const map = new Map();"
echo "    for (let i = 0; i < nums.length; i++) {"
echo "        if (map.has(target - nums[i])) {"
echo "            return [map.get(target - nums[i]), i];"
echo "        }"
echo "        map.set(nums[i], i);"
echo "    }"
echo "}"
echo ""
echo "3. Click '▶ Run Code'"
echo "4. Watch all tests pass! ✅"
echo ""
