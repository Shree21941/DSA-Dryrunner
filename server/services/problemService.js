const pool = require('../db/postgres');

// Get all problems with optional filtering
async function getAllProblems(difficulty = null, tags = null) {
  let query = 'SELECT id, title, difficulty, description, tags, language_codes FROM problems';
  const params = [];
  const conditions = [];

  if (difficulty) {
    conditions.push(`difficulty = $${params.length + 1}`);
    params.push(difficulty);
  }

  if (tags && tags.length > 0) {
    conditions.push(`tags && $${params.length + 1}`);
    params.push(tags);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY id ASC';

  const result = await pool.query(query, params);
  return result.rows;
}

// Get a single problem by ID with test cases
async function getProblemById(problemId) {
  const problemResult = await pool.query(
    `SELECT id, title, difficulty, description, starter_code, 
            time_complexity, space_complexity, tags, language_codes, created_at
     FROM problems WHERE id = $1`,
    [problemId]
  );

  if (problemResult.rows.length === 0) {
    return null;
  }

  const problem = problemResult.rows[0];

  // Get test cases (hidden ones excluded)
  const testCasesResult = await pool.query(
    `SELECT id, input, expected_output FROM test_cases 
     WHERE problem_id = $1 AND is_hidden = false
     ORDER BY id ASC`,
    [problemId]
  );

  return {
    ...problem,
    testCases: testCasesResult.rows,
  };
}

// Get all test cases for a problem (including hidden ones - for backend validation)
async function getAllTestCases(problemId) {
  const result = await pool.query(
    `SELECT id, input, expected_output, is_hidden FROM test_cases 
     WHERE problem_id = $1
     ORDER BY id ASC`,
    [problemId]
  );

  return result.rows;
}

// Get problems by difficulty
async function getProblemsByDifficulty(difficulty) {
  const result = await pool.query(
    `SELECT id, title, difficulty, description, tags FROM problems 
     WHERE difficulty = $1
     ORDER BY id ASC`,
    [difficulty]
  );

  return result.rows;
}

module.exports = {
  getAllProblems,
  getProblemById,
  getAllTestCases,
  getProblemsByDifficulty,
};
