const express = require('express');
const router = express.Router();
const pool = require('../db/postgres');
const { executeCode } = require('../services/executionService');
const { verifyToken } = require('../middleware/auth');

// POST /api/submissions - Submit code and run test cases
router.post('/', async (req, res) => {
  try {
    const { code, problemId, language = 'javascript' } = req.body;

    // Validate input
    if (!code || !problemId) {
      return res.status(400).json({
        success: false,
        error: 'Code and problemId are required',
      });
    }

    // Get user ID from auth token, or use demo user
    let userId = null;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const authService = require('../services/authService');
        const decoded = authService.verifyAccessToken(token);
        if (decoded) {
          userId = decoded.userId;
        }
      } catch (err) {
        // Token invalid, will use demo user
      }
    }

    // If no authenticated user, get the demo user
    if (!userId) {
      const demoUserResult = await pool.query(
        `SELECT id FROM users WHERE email = $1 LIMIT 1`,
        ['demo@dsadryrun.com']
      );

      if (demoUserResult.rows.length === 0) {
        return res.status(500).json({
          success: false,
          error: 'Demo user not found. Please run seed: npm run seed',
        });
      }

      userId = demoUserResult.rows[0].id;
    }

    // Get problem and test cases
    const problemResult = await pool.query(
      'SELECT id, title FROM problems WHERE id = $1',
      [problemId]
    );

    if (problemResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found',
      });
    }

    const problem = problemResult.rows[0];

    // Get test cases
    const testCasesResult = await pool.query(
      'SELECT id, input, expected_output FROM test_cases WHERE problem_id = $1 ORDER BY id',
      [problemId]
    );

    if (testCasesResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No test cases found for this problem',
      });
    }

    const testCases = testCasesResult.rows;

    // Execute code against test cases
    const executionResult = await executeCode(code, testCases, language);

    // Calculate status
    const status = executionResult.error
      ? 'error'
      : executionResult.testsFailed === 0
      ? 'accepted'
      : 'wrong_answer';

    // Store submission in database (for history)
    const submissionResult = await pool.query(
      `INSERT INTO submissions (user_id, problem_id, code, status, result)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [userId, problemId, code, status, JSON.stringify(executionResult)]
    );

    res.json({
      success: true,
      data: {
        submissionId: submissionResult.rows[0].id,
        problemId,
        problemTitle: problem.title,
        status,
        results: executionResult,
        timestamp: submissionResult.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
