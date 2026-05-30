# 🗺️ Architecture & Data Flow

## Database Schema (Simplified)

```
┌─────────────────┐         ┌────────────────┐
│     users       │         │  submissions   │
├─────────────────┤         ├────────────────┤
│ id (PK)         │◄────┐   │ id (PK)        │
│ email           │     │   │ user_id (FK)   │
│ username        │     │   │ problem_id (FK)│
│ password_hash   │     │   │ code           │
│ created_at      │     ├───│ status         │
└─────────────────┘     │   │ result (JSON)  │
                        │   │ created_at     │
                    (users │)└────────────────┘
                        │
                        │ When you submit code:
                        │ INSERT INTO submissions
                        │ VALUES (user_id=1, ...)
                        │
                        ▼
             ┌──────────────────────┐
             │ Test User            │
             ├──────────────────────┤
             │ id: 1                │
             │ email: demo@dsadryrun│
             │ username: demo_user  │
             └──────────────────────┘
```

## Submission Flow

```
┌─────────────────┐
│  Your Browser   │
│ or API Client   │
└────────┬────────┘
         │
         │ POST /api/submissions
         │ { code, problemId }
         │
         ▼
┌─────────────────────────────┐
│ submissions.js Route        │
│ ────────────────────────────│
│ 1. Get code from request    │
│ 2. Check for auth token     │
│    - If authenticated:      │
│      userId = req.user.id   │
│    - If NOT authenticated:  │
│      userId = 1 (demo user) │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ executionService.js         │
│ ────────────────────────────│
│ 1. Parse input test cases   │
│ 2. Create VM2 sandbox       │
│ 3. Execute your code        │
│ 4. Run all test cases       │
│ 5. Compare outputs          │
│ 6. Return results           │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ PostgreSQL submissions      │
│ ────────────────────────────│
│ INSERT INTO submissions     │
│ (                           │
│   user_id: 1,              │
│   problem_id: 5,           │
│   code: "...",             │
│   status: "accepted",      │
│   result: {                │
│     testsPassed: 4,        │
│     testsFailed: 0,        │
│     details: [...]         │
│   }                        │
│ )                          │
└────────┬────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Response to Your Browser      │
│ ──────────────────────────────│
│ {                            │
│   success: true,             │
│   data: {                    │
│     submissionId: 42,        │
│     status: "accepted",      │
│     testsPassed: 4,          │
│     results: [...]           │
│   }                          │
│ }                            │
└──────────────────────────────┘
```

## Code Execution Pipeline

```
Your Function Code
        │
        ▼
┌──────────────────────────┐
│ vm2 Sandbox              │
│ ──────────────────────── │
│ • Timeout: 5 seconds     │
│ • Resource limits        │
│ • Safe execution         │
└──────────┬───────────────┘
           │
           ├─ Check syntax
           │  ├─ ✅ Valid → Continue
           │  └─ ❌ Error → Return error
           │
           ├─ Extract function name
           │  ├─ ✅ Found → Continue
           │  └─ ❌ Not found → Return error
           │
           ▼
┌──────────────────────────┐
│ Test Case Loop           │
│ ──────────────────────── │
│ for each test case {     │
│   1. Parse input         │
│   2. Parse expected      │
│   3. Call your function  │
│   4. Get actual output   │
│   5. Compare with JSON   │
│      stringify           │
│   6. Mark pass/fail      │
│ }                        │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Results Object           │
│ ──────────────────────── │
│ {                        │
│   testsPassed: N,        │
│   testsFailed: M,        │
│   totalTests: N+M,       │
│   results: [             │
│     {                    │
│       testNumber: 1,     │
│       input: "...",      │
│       expected: "...",   │
│       actual: "...",     │
│       passed: true/false │
│     },                   │
│     ...                  │
│   ],                     │
│   error: null or message │
│ }                        │
└──────────┬───────────────┘
           │
           ▼
    Stored in DB & Returned to You
```

## Test Case Comparison

```
Test Case from Database:
┌─────────────────────────────────┐
│ input: "[2, 7, 11, 15], 9"     │
│ expected_output: "[0, 1]"       │
└─────────────────────────────────┘
                │
                ▼
    Parse and execute with your code:
┌─────────────────────────────────┐
│ Parse input:                    │
│   [2, 7, 11, 15], 9             │
│ Call func(                      │
│   [2, 7, 11, 15],               │
│   9                             │
│ )                               │
│ Get output: [0, 1]              │
└─────────────────────────────────┘
                │
                ▼
    Compare outputs:
┌─────────────────────────────────┐
│ JSON.stringify([0, 1])          │
│ === ?                           │
│ JSON.stringify([0, 1])          │
│                                 │
│ Result: MATCH ✅ PASS           │
└─────────────────────────────────┘
```

## User Authentication (Optional)

```
Request WITHOUT auth token:
┌──────────────────────────────┐
│ POST /api/submissions         │
│ Body:                        │
│ {                            │
│   code: "...",               │
│   problemId: 5               │
│ }                            │
│ Headers: (no Authorization)  │
└──────────┬───────────────────┘
           │
           ▼
Use demo user (id: 1)
           │
           ▼
INSERT INTO submissions (
  user_id: 1,
  ...
)

═════════════════════════════════

Request WITH auth token:
┌──────────────────────────────┐
│ POST /api/submissions         │
│ Body:                        │
│ {                            │
│   code: "...",               │
│   problemId: 5               │
│ }                            │
│ Headers:                     │
│ "Authorization: Bearer JWT" │
└──────────┬───────────────────┘
           │
           ▼
Verify JWT token
           │
           ├─ ✅ Valid → User ID: 42
           └─ ❌ Invalid → Use demo user
           │
           ▼
INSERT INTO submissions (
  user_id: 42 (or 1 if token invalid),
  ...
)
```

## Status Flow

```
Your Code
   │
   ▼
   ├─ Syntax Error?
   │  ├─ YES → Status: "error"
   │  └─ NO → Continue
   │
   ├─ Runtime Error?
   │  ├─ YES → Status: "error"
   │  └─ NO → Continue
   │
   ├─ All Tests Pass?
   │  ├─ YES → Status: "accepted" ✅
   │  └─ NO → Check failures
   │
   ├─ Some Tests Fail?
   │  ├─ YES → Status: "wrong_answer" ❌
   │  └─ NO → (Never reached)
   │
   ▼
Save to DB with status
```

## Response Structure

```json
{
  "success": true,
  "data": {
    "submissionId": 42,
    "problemId": 5,
    "problemTitle": "Fibonacci Sequence",
    "status": "accepted|wrong_answer|error",
    "results": {
      "testsPassed": 4,
      "testsFailed": 0,
      "totalTests": 4,
      "results": [
        {
          "testNumber": 1,
          "input": "0",
          "expected": "0",
          "actual": 0,
          "passed": true,
          "error": null
        },
        {
          "testNumber": 2,
          "input": "1",
          "expected": "1",
          "actual": 1,
          "passed": true,
          "error": null
        },
        // ... more test results
      ],
      "error": null
    },
    "timestamp": "2026-05-30T13:46:51.809Z"
  }
}
```

## Frontend Display

```
Browser (http://localhost:5173)

┌─────────────────────────────┐
│  Problem: Valid Parentheses │
│  ─────────────────────────  │
│  Description: Given a...    │
│  ─────────────────────────  │
│ ┌─────────────────────────┐ │
│ │ Code Editor             │ │
│ ├─────────────────────────┤ │
│ │ function isValid(s) {   │ │
│ │   // Your code here     │ │
│ │ }                       │ │
│ └─────────────────────────┘ │
│                             │
│  [▶ Run Code] [Reset]       │
│                             │
│ ┌─────────────────────────┐ │
│ │ Test Results            │ │
│ ├─────────────────────────┤ │
│ │ ✅ Test #1 PASSED      │ │
│ │ ✅ Test #2 PASSED      │ │
│ │ ✅ Test #3 PASSED      │ │
│ │                         │ │
│ │ Summary: 3 / 3 ✅       │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

**Everything flows through PostgreSQL with user tracking** ✅
