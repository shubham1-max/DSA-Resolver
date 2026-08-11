import { useState } from "react";
import { getSession } from "../api";
import { useStream } from "./useStream";

export const languages = ["C++", "Java", "Python", "JavaScript", "C"];

export const starterProblems = [
  "Given an array, return the length of the longest subarray with sum at most k.",
  "Find the first missing positive integer in an unsorted array.",
  "Design an LRU cache with get and put in O(1).",
];

const topicPatterns = [
  { topic: "Arrays", pattern: /\b(array|subarray|index|element)\b/i },
  { topic: "Sliding Window", pattern: /\b(window|subarray|contiguous|longest|shortest)\b/i },
  { topic: "Two Pointers", pattern: /\b(two pointers|sorted|pair|left|right)\b/i },
  { topic: "Binary Search", pattern: /\b(binary search|sorted array|log n)\b/i },
  { topic: "Dynamic Programming", pattern: /\b(dp|dynamic programming|memo|tabulation)\b/i },
  { topic: "Graph", pattern: /\b(graph|bfs|dfs|node|edge|adjacency)\b/i },
  { topic: "Tree", pattern: /\b(tree|binary tree|root|leaf|bst)\b/i },
  { topic: "Stack / Queue", pattern: /\b(stack|queue|monotonic|deque)\b/i },
  { topic: "Hash Map", pattern: /\b(hash|map|dictionary|frequency|lookup)\b/i },
  { topic: "Greedy", pattern: /\b(greedy|interval|schedule|minimum)\b/i },
];

export function detectTopic(question) {
  const match = topicPatterns.find(({ pattern }) => pattern.test(question));
  return match?.topic || "General DSA";
}

export function useSolver({ refreshAfterSolve, setNotice, initialQuestion = "" }) {
  const [question, setQuestion] = useState(initialQuestion);
  const [language, setLanguage] = useState("C++");
  const [result, setResult] = useState(null);
  const [problemId, setProblemId] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [detectedTopic, setDetectedTopic] = useState("");
  const { streamText, loading, resetStream, cancelStream, startStream } = useStream();

  async function resolveProblem() {
    const trimmed = question.trim();

    if (!trimmed) {
      setNotice("Paste a problem statement first.");
      return;
    }

    setDetectedTopic(detectTopic(trimmed));

    if (!getSession()?.token) {
      setNotice("Sign in to resolve problems with live AI streaming.");
      return;
    }

    resetStream();
    setResult(null);
    setProblemId(null);
    setHintsUsed(0);
    setNotice("");

    try {
      const { data, problemId: id, alreadySolved, message } = await startStream({ question: trimmed, language });
      setResult(data);
      setProblemId(id);
      
      if (alreadySolved) {
        setNotice(message || "This question was already solved.");
      } else {
        await refreshAfterSolve?.();
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setNotice(error.message);
      }
    }
  }

  function setHintsUsedCount(count) {
    setHintsUsed(count);
  }

  return {
    question,
    setQuestion,
    language,
    setLanguage,
    result,
    problemId,
    hintsUsed,
    setHintsUsedCount,
    detectedTopic,
    streamText,
    loading,
    cancelStream,
    resolveProblem,
  };
}
