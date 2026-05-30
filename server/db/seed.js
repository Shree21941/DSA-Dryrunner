require('dotenv').config();
const pool = require('./postgres');
const fs = require('fs');
const path = require('path');
const { STARTER_CODES } = require('./languages');
const bcrypt = require('bcryptjs');

// The 10 seed problems from the spec
const SEED_PROBLEMS = [
  {
    title: 'Two Sum',
    difficulty: 'easy',
    description: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume each input has exactly one solution, and you cannot use the same element twice.',
    starterCode: 'function twoSum(nums, target) {\n    // Write your solution here\n}',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    tags: ['array', 'hash-table', 'two-pointer'],
    testCases: [
      { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]' },
      { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]' },
    ],
  },
  {
    title: 'Binary Search',
    difficulty: 'easy',
    description: 'Given a sorted array of integers nums and an integer target, return the index of target if it is in nums, or -1 if it is not in nums. You must write an algorithm with O(log n) runtime complexity.',
    starterCode: 'function binarySearch(nums, target) {\n    // Write your solution here\n}',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    tags: ['array', 'binary-search'],
    testCases: [
      { input: '[-1, 0, 3, 5, 9, 12], 9', expectedOutput: '4' },
      { input: '[-1, 0, 3, 5, 9, 12], 13', expectedOutput: '-1' },
    ],
  },
  {
    title: 'Valid Parentheses',
    difficulty: 'easy',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. An input string is valid if: 1) Open brackets must be closed by the same type of brackets. 2) Open brackets must be closed in the correct order.',
    starterCode: 'function isValid(s) {\n    // Write your solution here\n}',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    tags: ['string', 'stack'],
    testCases: [
      { input: '"()"', expectedOutput: 'true' },
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' },
    ],
  },
  {
    title: 'Merge Sorted Arrays',
    difficulty: 'easy',
    description: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of valid elements in nums1 and nums2 respectively. Merge nums2 into nums1 as one sorted array.',
    starterCode: 'function merge(nums1, m, nums2, n) {\n    // Write your solution here\n    // Modify nums1 in-place\n}',
    timeComplexity: 'O(m + n)',
    spaceComplexity: 'O(1)',
    tags: ['array', 'two-pointer', 'sorting'],
    testCases: [
      { input: '[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3', expectedOutput: '[1, 2, 2, 3, 5, 6]' },
      { input: '[1], 1, [], 0', expectedOutput: '[1]' },
    ],
  },
  {
    title: 'Fibonacci Sequence',
    difficulty: 'easy',
    description: 'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).',
    starterCode: 'function fib(n) {\n    // Write your solution here\n    // Return F(n)\n}',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    tags: ['recursion', 'dynamic-programming', 'math'],
    testCases: [
      { input: '0', expectedOutput: '0' },
      { input: '1', expectedOutput: '1' },
      { input: '4', expectedOutput: '3' },
      { input: '10', expectedOutput: '55' },
    ],
  },
  {
    title: 'BFS - Graph Traversal',
    difficulty: 'medium',
    description: 'Given an undirected graph represented as an adjacency list, perform a breadth-first search starting from node 0. Return an array of nodes in the order they are visited.',
    starterCode: 'function bfs(graph) {\n    // Write your solution here\n    // graph is an adjacency list\n}',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    tags: ['graph', 'bfs', 'queue'],
    testCases: [
      { input: '[[1, 2], [0, 3], [0], [1]]', expectedOutput: '[0, 1, 2, 3]' },
    ],
  },
  {
    title: 'DFS - Graph Traversal',
    difficulty: 'medium',
    description: 'Given an undirected graph represented as an adjacency list, perform a depth-first search starting from node 0. Return an array of nodes in the order they are visited.',
    starterCode: 'function dfs(graph) {\n    // Write your solution here\n    // graph is an adjacency list\n}',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    tags: ['graph', 'dfs', 'recursion'],
    testCases: [
      { input: '[[1, 2], [0, 3], [0], [1]]', expectedOutput: '[0, 1, 3, 2]' },
    ],
  },
  {
    title: 'Dijkstra Shortest Path',
    difficulty: 'hard',
    description: 'Given a weighted undirected graph and a starting node, find the shortest distance to all other nodes using Dijkstra\'s algorithm. Return an array of distances where index i is the shortest distance to node i.',
    starterCode: 'function dijkstra(graph, start) {\n    // Write your solution here\n    // graph[i] = [[neighbor, weight], ...]\n}',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    tags: ['graph', 'shortest-path', 'greedy'],
    testCases: [
      { input: '[[[1, 4], [2, 1]], [[0, 4], [2, 2]], [[0, 1], [1, 2]]], 0', expectedOutput: '[0, 3, 1]' },
    ],
  },
  {
    title: 'LRU Cache',
    difficulty: 'hard',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get(key) and put(key, value) methods, both running in O(1) time.',
    starterCode: 'class LRUCache {\n    constructor(capacity) {\n        // Write your implementation\n    }\n    \n    get(key) {\n        // Return the value of the key if exists, otherwise return -1\n    }\n    \n    put(key, value) {\n        // Update the value if the key exists. Otherwise, add the key-value pair\n    }\n}',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(capacity)',
    tags: ['hash-table', 'linked-list', 'design'],
    testCases: [
      { input: 'capacity=2; put(1, 1); put(1, 2); get(1)', expectedOutput: '2' },
      { input: 'capacity=2; put(1, 1); put(2, 2); put(3, 3); get(1)', expectedOutput: '-1' },
    ],
  },
  {
    title: 'Climbing Stairs',
    difficulty: 'easy',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top? Given an integer n, return the number of distinct ways to climb to the top.',
    starterCode: 'function climbStairs(n) {\n    // Write your solution here\n    // Return the number of ways to climb n stairs\n}',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    tags: ['dynamic-programming', 'recursion', 'math'],
    testCases: [
      { input: '2', expectedOutput: '2' },
      { input: '3', expectedOutput: '3' },
      { input: '4', expectedOutput: '5' },
    ],
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log('🌱 Starting seed...');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    try {
      await client.query(schema);
      console.log('✅ Schema created');
    } catch (err) {
      if (err.code === '42710') {
        // Type already exists, that's okay
        console.log('ℹ️  Schema already exists, continuing with data insert...');
      } else {
        throw err;
      }
    }

    // Create test user for demo submissions
    const testUserEmail = 'demo@dsadryrun.com';
    const testUserPassword = 'Demo@123';
    const hashedPassword = await bcrypt.hash(testUserPassword, 10);

    try {
      const userResult = await client.query(
        `INSERT INTO users (email, username, password_hash) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
        [testUserEmail, 'demo_user', hashedPassword]
      );
      
      if (userResult.rows.length > 0) {
        console.log(`✅ Created test user: ${testUserEmail}`);
      } else {
        console.log(`ℹ️  Test user already exists: ${testUserEmail}`);
      }
    } catch (err) {
      console.log(`ℹ️  Test user setup: ${err.message}`);
    }

    // Seed problems
    for (const problem of SEED_PROBLEMS) {
      // Get language codes for this problem
      const languageCodes = STARTER_CODES[problem.title] || {
        javascript: problem.starterCode,
        java: '',
        c: '',
        cpp: '',
      };

      const result = await client.query(
        `INSERT INTO problems (title, difficulty, description, starter_code, time_complexity, space_complexity, tags, language_codes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT DO NOTHING
         RETURNING id`,
        [
          problem.title,
          problem.difficulty,
          problem.description,
          problem.starterCode,
          problem.timeComplexity,
          problem.spaceComplexity,
          problem.tags,
          JSON.stringify(languageCodes),
        ]
      );

      if (result.rows.length === 0) {
        console.log(`⊘ Already seeded: ${problem.title}`);
        continue;
      }

      const problemId = result.rows[0].id;

      // Seed test cases
      for (const testCase of problem.testCases) {
        await client.query(
          `INSERT INTO test_cases (problem_id, input, expected_output)
           VALUES ($1, $2, $3)
           ON CONFLICT DO NOTHING`,
          [problemId, testCase.input, testCase.expectedOutput]
        );
      }

      console.log(`✅ Seeded: ${problem.title} (ID: ${problemId})`);
    }

    console.log('🌱 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
