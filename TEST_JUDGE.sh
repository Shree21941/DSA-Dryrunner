#!/bin/bash

# ==========================================
# DSA DRYRUN - Test Your Judge System
# ==========================================
# This script tests that the judge system:
# 1. Accepts ANY code (brute force, optimal, different approaches)
# 2. Judges ONLY on correctness (output matching)
# 3. Provides detailed feedback on failures

echo "======================================"
echo "🧪 DSA DryRun Judge System Test"
echo "======================================"
echo ""
echo "Make sure to run these first:"
echo "  cd /home/shreesh-kolhatkar/Documents/DDR/DSA-Dryrunner"
echo "  sudo docker-compose down -v && sudo docker-compose up -d --build"
echo "  sleep 15"
echo "  sudo docker exec dsa-dryrunner_server_1 npm run seed"
echo ""
read -p "Press ENTER when ready..."
echo ""

# Test 1: Correct solution
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 1: ✅ OPTIMAL SOLUTION (Fibonacci Recursive)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Code: function fib(n) { return n <= 1 ? n : fib(n-1) + fib(n-2); }"
echo ""
curl -s -X POST http://localhost:3001/api/submissions \
  -H "Content-Type: application/json" \
  -d '{"code":"function fib(n) { return n <= 1 ? n : fib(n-1) + fib(n-2); }","problemId":5,"language":"javascript"}' \
  | jq '.data | {status, testsPassed: .results.testsPassed, testsFailed: .results.testsFailed, total: .results.totalTests}'
echo ""
echo "✓ Result: Should show status='accepted', testsPassed=4, testsFailed=0"
echo ""
echo ""

# Test 2: Different approach - also correct
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 2: ✅ DIFFERENT APPROACH (Fibonacci DP)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Code: function fib(n) { const arr = [0, 1]; for(let i=2; i<=n; i++) arr[i]=arr[i-1]+arr[i-2]; return arr[n]; }"
echo ""
curl -s -X POST http://localhost:3001/api/submissions \
  -H "Content-Type: application/json" \
  -d '{"code":"function fib(n) { const arr = [0, 1]; for(let i=2; i<=n; i++) arr[i]=arr[i-1]+arr[i-2]; return arr[n]; }","problemId":5,"language":"javascript"}' \
  | jq '.data | {status, testsPassed: .results.testsPassed, testsFailed: .results.testsFailed, total: .results.totalTests}'
echo ""
echo "✓ Result: Should also show status='accepted', testsPassed=4, testsFailed=0"
echo ""
echo "💡 Key Point: Different approach, same correctness → Both pass!"
echo ""
echo ""

# Test 3: Incorrect solution
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 3: ❌ INCORRECT SOLUTION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Code: function fib(n) { return n * 2; }"
echo ""
RESULT=$(curl -s -X POST http://localhost:3001/api/submissions \
  -H "Content-Type: application/json" \
  -d '{"code":"function fib(n) { return n * 2; }","problemId":5,"language":"javascript"}' \
  | jq '.data | {status, testsPassed: .results.testsPassed, testsFailed: .results.testsFailed, failedTests: [.results.results[] | select(.passed==false) | {test: .testNumber, input, expected, actual}]}'
)
echo "$RESULT"
echo ""
echo "✓ Result: Should show status='wrong_answer', testsFailed=3"
echo "✓ Detailed: Shows exactly which tests failed and why"
echo ""
echo ""

# Test 4: Valid Parentheses - Stack approach
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 4: ✅ VALID PARENTHESES (Stack Approach)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Code: function isValid(s) {"
echo "  const stack = [];"
echo "  const pairs = {\")\": \"(\", \"}\": \"{\", \"]\": \"[\"};"
echo "  for (const ch of s) {"
echo "    if (ch === \"(\" || ch === \"{\" || ch === \"[\") {"
echo "      stack.push(ch);"
echo "    } else {"
echo "      if (stack.length === 0 || stack.pop() !== pairs[ch]) {"
echo "        return false;"
echo "      }"
echo "    }"
echo "  }"
echo "  return stack.length === 0;"
echo "}"
echo ""
curl -s -X POST http://localhost:3001/api/submissions \
  -H "Content-Type: application/json" \
  -d '{"code":"function isValid(s) { const stack = []; const pairs = {\")\": \"(\", \"}\": \"{\", \"]\": \"[\"}; for (const ch of s) { if (ch === \"(\" || ch === \"{\" || ch === \"[\") { stack.push(ch); } else { if (stack.length === 0 || stack.pop() !== pairs[ch]) { return false; } } } return stack.length === 0; }","problemId":3,"language":"javascript"}' \
  | jq '.data | {status, testsPassed: .results.testsPassed, testsFailed: .results.testsFailed, total: .results.totalTests}'
echo ""
echo "✓ Result: Should show status='accepted', testsPassed=3, testsFailed=0"
echo ""
echo ""

# Test 5: Valid Parentheses - Wrong solution
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 5: ❌ VALID PARENTHESES (Wrong)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Code: function isValid(s) { return true; }"
echo ""
RESULT=$(curl -s -X POST http://localhost:3001/api/submissions \
  -H "Content-Type: application/json" \
  -d '{"code":"function isValid(s) { return true; }","problemId":3,"language":"javascript"}' \
  | jq '.data | {status, testsPassed: .results.testsPassed, testsFailed: .results.testsFailed, failedTest: .results.results[2] | {test: .testNumber, input, expected, got: .actual}}'
)
echo "$RESULT"
echo ""
echo "✓ Result: Should show status='wrong_answer', testsFailed=1"
echo "✓ Shows: Test #3 with input '(]' expected false but got true"
echo ""
echo ""

echo "======================================"
echo "✅ ALL TESTS COMPLETED!"
echo "======================================"
echo ""
echo "Summary:"
echo "✓ Different algorithms, same output → Both pass"
echo "✓ Wrong algorithms → Fails with detailed feedback"
echo "✓ Judge is correctness-agnostic"
echo "✓ Each test shows exactly what went wrong"
echo ""
echo "This is exactly how LeetCode works! 🎓"
echo ""
