const express = require("express");

const {
  solveProblem,
  getHistory,
  updateHint,
  toggleBookmark,
  evaluateExplanation,
  getProblemById,
} = require("../controllers/problem.controller");

const {
  verifyToken,
} = require("../middlewares/auth.middleware");

const {
  solveLimiter,
} = require("../middlewares/rateLimit.middleware");

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// SSE route — apply rate limiting only to solve endpoint
router.post("/solve", solveLimiter, solveProblem);

router.get("/history", getHistory);

router.get("/:id", getProblemById);

router.patch("/:id/hint", updateHint);

router.patch("/:id/bookmark", toggleBookmark);

router.post("/evaluate", evaluateExplanation);

module.exports = router;