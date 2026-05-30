const express = require('express');
const router = express.Router();
const problemService = require('../services/problemService');

// GET /api/problems - Get all problems with optional filtering
router.get('/', async (req, res) => {
  try {
    const { difficulty, tags } = req.query;
    const tagsArray = tags ? tags.split(',') : null;

    const problems = await problemService.getAllProblems(difficulty, tagsArray);

    res.json({
      success: true,
      data: problems,
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch problems',
    });
  }
});

// GET /api/problems/:id - Get a specific problem with test cases
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID is a number
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid problem ID',
      });
    }

    const problem = await problemService.getProblemById(parseInt(id));

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found',
      });
    }

    res.json({
      success: true,
      data: problem,
    });
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch problem',
    });
  }
});

// GET /api/problems/:id/difficulty - Get problems by difficulty level
router.get('/difficulty/:difficulty', async (req, res) => {
  try {
    const { difficulty } = req.params;
    const validDifficulties = ['easy', 'medium', 'hard'];

    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid difficulty level',
      });
    }

    const problems = await problemService.getProblemsByDifficulty(difficulty);

    res.json({
      success: true,
      data: problems,
    });
  } catch (error) {
    console.error('Error fetching problems by difficulty:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch problems',
    });
  }
});

module.exports = router;
