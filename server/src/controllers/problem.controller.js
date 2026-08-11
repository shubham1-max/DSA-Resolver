const Problem = require("../models/problem.model");
const { streamSolution, evaluateStudentAnswer } = require("../services/ai.service");
const { updateStreak } = require("../services/streak.service");
const { sanitizeQuestion } = require("../services/prompt.builder"); 
// POST /problem/solve
const solveProblem = async (req, res) => {
  // Guard: verifyToken middleware should always set req.user
  if (!req.user?.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { question, language = "C++" } = req.body;

  const sanitized = sanitizeQuestion(question);

 if (!sanitized.ok) {
    return res.status(400).json({
      error: sanitized.reason,
    });
  }
  const ALLOWED_LANGUAGES = [
    "C++",
    "Java",
    "Python",
    "JavaScript",
    "C",
  ];

  if (!ALLOWED_LANGUAGES.includes(language)) {
    return res.status(400).json({
      error: "Unsupported language",
    });
  }

  // Check if user already solved this exact question in the same language
  const existingProblem = await Problem.findOne({
    userId: req.user.id,
    question: question.trim(),
    language: language,
    status: "complete"
  });

  if (existingProblem) {
    return res.status(200).json({
      alreadySolved: true,
      message: `Question already solved on ${existingProblem.solvedAt?.toLocaleDateString()}`,
      data: existingProblem.aiResponse,
      problemId: existingProblem._id,
      solvedAt: existingProblem.solvedAt
    });
  }

  let problemDoc;

  // Save problem before AI call
  try {
    problemDoc = await Problem.create({
      userId: req.user.id,
      question: question.trim(),
      language,
      status: "pending",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to create problem record",
    });
  }

  let parsed;

try {
    // Call AI service
    parsed = await streamSolution(
      question,
      language,
      res,
      problemDoc._id,
    );
  } catch (err) {
    console.error("[solveProblem] Error during streaming:", err);

  
    await Problem.findByIdAndUpdate(
      problemDoc._id,
      {
        status: "error",
      }
    );

    
    if (res.headersSent) {
   
        if (!res.writableEnded) {
            res.end();
        }
    } else {
      
        return res.status(500).json({
            error: "AI service failed",
        });
    }
  }




  if (parsed) {
    await Problem.findByIdAndUpdate(
      problemDoc._id,
      {
        aiResponse: parsed,
        status: "complete",
        solvedAt: new Date(),
      }
    );

    res.write(
      `data: ${JSON.stringify({
        done: true,
        data: parsed,
        problemId: problemDoc._id,
      })}\n\n`,
    );
    res.end();

  const rawOffset = parseInt(req.headers['x-tz-offset']) || 0;
  const tzOffset = Math.max(-720, Math.min(720, rawOffset));
  await updateStreak(req.user.id, tzOffset);

  } 
  
  else {
    await Problem.findByIdAndUpdate(
      problemDoc._id,
      {
        status: "error",
      }
    );
  }
};

// GET /problem/history
const getHistory = async (req, res, next) => {
  try {
    const page = Math.max(
      1,
      parseInt(req.query.page) || 1
    );

    const limit = Math.min(
      50,
      Math.max(
        1,
        parseInt(req.query.limit) || 20
      )
    );

    const problems = await Problem.find({
      userId: req.user.id,
      status: "complete",
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-aiResponse");

    const total = await Problem.countDocuments({
      userId: req.user.id,
      status: "complete",
    });

    return res.status(200).json({
      problems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /problem/:id/hint
const updateHint = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    if (problem.hintsUsed >= 3) {
      return res.status(400).json({
        error: "All hints already revealed",
      });
    }

    problem.hintsUsed += 1;

    await problem.save();

    return res.status(200).json({
      hintsUsed: problem.hintsUsed,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /problem/:id/bookmark
const toggleBookmark = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    problem.bookmarked = !problem.bookmarked;

    await problem.save();

    return res.status(200).json({
      bookmarked: problem.bookmarked,
    });
  } catch (err) {
    next(err);
  }
};

// POST /problem/evaluate
const evaluateExplanation = async (req, res, next) => {
  try {
    const { question, studentAnswer, correctSolution } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'question is required and must be a non-empty string' });
    }
    if (!studentAnswer || typeof studentAnswer !== 'string' || !studentAnswer.trim()) {
      return res.status(400).json({ error: 'studentAnswer is required and must be a non-empty string' });
    }
    if (!correctSolution || typeof correctSolution !== 'string' || !correctSolution.trim()) {
      return res.status(400).json({ error: 'correctSolution is required and must be a non-empty string' });
    }

    const evaluation = await evaluateStudentAnswer(question, studentAnswer, correctSolution);

    return res.status(200).json(evaluation);
  } catch (err) {
    next(err);
  }
};

// GET /problem/:id
const getProblemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    return res.status(200).json(problem);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  solveProblem,
  getHistory,
  updateHint,
  toggleBookmark,
  evaluateExplanation,
  getProblemById,
};