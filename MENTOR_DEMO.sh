#!/bin/bash

# 🚀 DSA DryRun - Mentor Presentation Guide
# Run these commands in order to start and demonstrate the project

echo "════════════════════════════════════════════════════════════════"
echo "DSA DryRun - Interactive Code Execution Visualizer"
echo "Ready for Mentor Presentation"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Step 1: Navigate to project
echo "📍 Step 1: Navigate to project directory"
echo "Command: cd /home/shreesh-kolhatkar/Documents/DDR/DSA-Dryrunner"
echo ""

# Step 2: Start the stack
echo "🚀 Step 2: Start Docker containers (postgres, redis, backend, frontend)"
echo "Command: sudo docker-compose up -d"
echo ""

# Step 3: Wait for services
echo "⏳ Step 3: Wait 10 seconds for all services to start"
echo "Command: sleep 10"
echo ""

# Step 4: Verify stack is running
echo "✅ Step 4: Verify all containers are running"
echo "Command: sudo docker-compose ps"
echo "Expected: 4 containers UP (postgres, redis, server, client)"
echo ""

# Step 5: Seed the database
echo "🌱 Step 5: Seed database with 10 DSA problems"
echo "Command: sudo docker exec dsa-dryrunner_server_1 npm run seed"
echo "Expected: ✅ Seeded: Two Sum, Binary Search, ... (all 10 problems)"
echo ""

# Step 6: Test backend API
echo "🔌 Step 6: Test backend API - Verify all problems loaded"
echo "Command: curl -s http://localhost:3001/api/problems | jq '.data | length'"
echo "Expected: 10"
echo ""

# Step 7: Open frontend
echo "🌐 Step 7: Open frontend in browser"
echo "URL: http://localhost:5173"
echo "Expected: See problem list with all 10 DSA problems"
echo ""

# Step 8: Test running code
echo "💻 Step 8: Test 'Run Code' feature in browser"
echo "1. Click 'Two Sum' problem"
echo "2. Write or paste JavaScript code in editor"
echo "3. Click 'Run Code' button"
echo "4. See test results (✅ PASSED / ❌ FAILED)"
echo ""

# Step 9: Test API directly
echo "🧪 Step 9: Test submission API from terminal (optional)"
echo 'Command: curl -X POST http://localhost:3001/api/submissions \\'
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"code\":\"function twoSum(nums, target) { const map = new Map(); for (let i = 0; i < nums.length; i++) { if (map.has(target - nums[i])) return [map.get(target - nums[i]), i]; map.set(nums[i], i); } }\",\"problemId\":1,\"language\":\"javascript\"}' | jq"
echo ""

# Step 10: Show logs
echo "📊 Step 10: Monitor logs in real-time (in new terminal)"
echo "Command: sudo docker-compose logs -f server"
echo "Shows: API requests, executions, database queries"
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "✅ PRESENTATION CHECKLIST"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "☑ Stack running:          sudo docker-compose ps"
echo "☑ 10 problems loaded:     curl http://localhost:3001/api/problems | jq '.data | length'"
echo "☑ Frontend working:       http://localhost:5173"
echo "☑ 4 languages support:    Click problem → See JS, Java, C, C++ tabs"
echo "☑ Run Code functional:    Click problem → Write code → Click Run → See results"
echo "☑ Test cases visible:     See all test results with Expected vs Actual"
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "🎯 KEY FEATURES TO SHOW"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "1. Problem List"
echo "   └─ All 10 DSA problems with difficulty badges"
echo "   └─ Filter by difficulty (Easy, Medium, Hard)"
echo ""
echo "2. Problem Detail Page"
echo "   ├─ Problem statement & description"
echo "   ├─ Time/Space complexity"
echo "   ├─ Tags (array, hash-table, etc.)"
echo "   └─ Test cases preview"
echo ""
echo "3. Code Editor"
echo "   ├─ Monaco editor (same as VS Code)"
echo "   ├─ 4 language tabs: JavaScript | Java | C | C++"
echo "   ├─ Syntax highlighting for each language"
echo "   ├─ Pre-loaded starter code for each language"
echo "   └─ Run Code button with live results"
echo ""
echo "4. Test Results"
echo "   ├─ Visual cards for each test case"
echo "   ├─ Green highlight = ✅ PASSED"
echo "   ├─ Red highlight = ❌ FAILED"
echo "   ├─ Shows Expected vs Actual output"
echo "   └─ Real-time execution results"
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "📱 DEMO PROBLEM: Try 'Two Sum'"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Sample Working Solution (JavaScript):"
echo ""
echo 'function twoSum(nums, target) {'
echo '    const map = new Map();'
echo '    for (let i = 0; i < nums.length; i++) {'
echo '        if (map.has(target - nums[i])) {'
echo '            return [map.get(target - nums[i]), i];'
echo '        }'
echo '        map.set(nums[i], i);'
echo '    }'
echo '}'
echo ""
echo "Result: ✅ All 2 tests PASSED"
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "🛑 TO STOP THE STACK"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Command: sudo docker-compose down"
echo ""
