#!/bin/bash

# 🎯 QUICK START COMMANDS FOR MENTOR DEMO
# Copy & paste these commands in order

# ════════════════════════════════════════════════════════════════
# 1️⃣ NAVIGATE TO PROJECT
# ════════════════════════════════════════════════════════════════
cd /home/shreesh-kolhatkar/Documents/DDR/DSA-Dryrunner


# ════════════════════════════════════════════════════════════════
# 2️⃣ START THE STACK (Postgres, Redis, Backend, Frontend)
# ════════════════════════════════════════════════════════════════
sudo docker-compose up -d


# ════════════════════════════════════════════════════════════════
# 3️⃣ WAIT FOR SERVICES TO START
# ════════════════════════════════════════════════════════════════
sleep 15


# ════════════════════════════════════════════════════════════════
# 4️⃣ VERIFY STACK IS RUNNING
# ════════════════════════════════════════════════════════════════
sudo docker-compose ps
# Should show 4 containers: postgres, redis, server, client - all UP


# ════════════════════════════════════════════════════════════════
# 5️⃣ SEED DATABASE WITH 10 PROBLEMS
# ════════════════════════════════════════════════════════════════
sudo docker exec dsa-dryrunner_server_1 npm run seed
# Should show: ✅ Seeded: Two Sum, Binary Search, Valid Parentheses, etc.


# ════════════════════════════════════════════════════════════════
# 6️⃣ VERIFY BACKEND API IS WORKING
# ════════════════════════════════════════════════════════════════
curl -s http://localhost:3001/api/problems | jq '.data | length'
# Should return: 10


# ════════════════════════════════════════════════════════════════
# 7️⃣ VERIFY FRONTEND IS RUNNING
# ════════════════════════════════════════════════════════════════
curl -s http://localhost:5173 | grep -q "DSA DryRun" && echo "✅ Frontend is up!"


# ════════════════════════════════════════════════════════════════
# 8️⃣ OPEN IN BROWSER
# ════════════════════════════════════════════════════════════════
# Frontend:  http://localhost:5173
# Backend API: http://localhost:3001/api/problems


# ════════════════════════════════════════════════════════════════
# 9️⃣ TEST RUN CODE FEATURE (via API)
# ════════════════════════════════════════════════════════════════
curl -X POST http://localhost:3001/api/submissions \
  -H "Content-Type: application/json" \
  -d '{"code":"function twoSum(nums, target) { const map = new Map(); for (let i = 0; i < nums.length; i++) { if (map.has(target - nums[i])) return [map.get(target - nums[i]), i]; map.set(nums[i], i); } }","problemId":1,"language":"javascript"}' | jq


# ════════════════════════════════════════════════════════════════
# 🔟 VIEW LOGS IN REAL-TIME (open in new terminal)
# ════════════════════════════════════════════════════════════════
sudo docker-compose logs -f server


# ════════════════════════════════════════════════════════════════
# 🛑 STOP THE STACK
# ════════════════════════════════════════════════════════════════
sudo docker-compose down
