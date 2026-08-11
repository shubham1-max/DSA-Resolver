const { z } = require("zod");

const aiResponseSchema = z.object({
  topic: z.string(),

  firstPrinciples: z.array(z.string()),

  hints: z.object({
    hint1: z.string(),
    hint2: z.string(),
    pseudocode: z.string(),
  }),

  intuition: z.union([z.string(), z.array(z.string())]),

  bruteForce: z.object({
    explanation: z.union([z.string(), z.array(z.string())]),
    code: z.string(),
    time: z.string(),
    timeReason: z.string().optional(),
    space: z.string(),
    spaceReason: z.string().optional(),
  }),

  optimalSolutions: z.object({
    sameLogic: z.boolean(),

    solutions: z.array(
      z.object({
        label: z.string(),
        style: z.string(),
        explanation: z.union([z.string(), z.array(z.string())]),
        code: z.string(),
        time: z.string(),
        timeReason: z.string().optional(),
        space: z.string(),
        spaceReason: z.string().optional(),

        keyInsight: z.string().optional(),
        intuitionAnalogy: z.string().optional(),
        spaceOptimization: z.string().optional(),

        dryRun: z.union([z.string(), z.array(z.string())]).optional(),
        whatEachVariableDoes: z.string().optional(),

        pseudocode: z.string().optional(),
        edgeCases: z.array(z.string()).optional(),
        correctnessProof: z.string().optional(),
      })
    ).min(1).max(3),
  }),

  traceTable: z.object({
    variables: z.array(z.string()),

    rows: z.array(
      z.union([
        z.record(z.any()),
        z.array(z.any()),
      ])
    ),
  }),

  edgeCases: z.array(z.string()),

  interviewTip: z.string(),

  explainBackPrompt: z.string(),
});

module.exports = {
  aiResponseSchema,
};