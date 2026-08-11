import { useCallback, useEffect, useRef, useState } from "react";
import { getSession, solveProblem } from "../api";

export function useStream() {
  const [streamText, setStreamText] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);

  const resetStream = useCallback(() => {
    setStreamText("");
  }, []);

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
  }, []);

  const startStream = useCallback(async ({ question, language }) => {
    if (!getSession()?.token) {
      throw new Error("Sign in to stream AI solutions from the server.");
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setStreamText("");

    try {
      const { data, problemId, alreadySolved, message, solvedAt } = await solveProblem({
        question,
        language,
        signal: controller.signal,
        onToken: (token) => setStreamText((current) => current + token),
      });

      return { data, problemId, alreadySolved, message, solvedAt };
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return {
    streamText,
    loading,
    resetStream,
    cancelStream,
    startStream,
  };
}
