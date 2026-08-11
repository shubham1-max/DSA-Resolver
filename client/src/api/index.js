const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const storageKey = "dsa_resolver_session";

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(storageKey));
  } catch {
    return null;
  }
}

export function saveSession(session) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(session));
  } catch (err) {
    console.warn("Failed to save session to localStorage", err);
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(storageKey);
  } catch (err) {
    console.warn("Failed to clear session from localStorage", err);
  }
}

async function request(path, options = {}) {
  const session = getSession();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  // Auto-signout on expired/invalid token — clears broken session
  if (response.status === 401) {
    clearSession();
    // Only reload if we had a session (avoids infinite reload on login page)
    if (session?.token) {
      window.location.href = "/login";
    }
    throw new Error(payload.error || "Session expired. Please sign in again.");
  }

  if (!response.ok) {
    throw new Error(payload.error || payload.msg || "Request failed");
  }

  return payload;
}

export function login(email, password) {
  return request("/user/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(name, email, password) {
  return request("/user/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function verifyOtp(email, otp) {
  return request("/user/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export function resendOtp(email) {
  return request("/user/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function forgotPassword(email) {
  return request("/user/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(email, otp, newPassword) {
  return request("/user/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, otp, newPassword }),
  });
}

export function googleAuth(idToken) {
  return request("/user/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
}

export function completeGoogleSignup(pendingToken, password) {
  return request("/user/complete-google-signup", {
    method: "POST",
    body: JSON.stringify({ pendingToken, password }),
  });
}

export function getMe() {
  return request("/user/me");
}

export function getHistory(page = 1, limit = 20) {
  return request(`/problem/history?page=${page}&limit=${limit}`);
}

export function revealHint(problemId) {
  return request(`/problem/${problemId}/hint`, {
    method: "PATCH",
  });
}

export function toggleBookmark(problemId) {
  return request(`/problem/${problemId}/bookmark`, {
    method: "PATCH",
  });
}

export async function solveProblem({ question, language, onToken, signal }) {
  const session = getSession();
  const response = await fetch(`${API_BASE}/problem/solve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.token || ""}`,
      "x-tz-offset": String(new Date().getTimezoneOffset()),
    },
    body: JSON.stringify({ question, language }),
    signal,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || payload.msg || "Could not solve problem");
  }

  if (response.headers.get("Content-Type")?.includes("application/json")) {
    return await response.json();
  }

  if (!response.body) {
    throw new Error("Streaming is not supported in this browser");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalData = null;
  let problemId = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      const line = event.split("\n").find((item) => item.startsWith("data: "));
      if (!line) continue;

      try {
        const payload = JSON.parse(line.slice(6));
        if (payload.token) onToken?.(payload.token);
        if (payload.error) throw new Error(payload.error);
        if (payload.done) {
          finalData = payload.data;
          problemId = payload.problemId || null;
        }
      } catch (parseErr) {
        // Skip malformed SSE chunks but surface actual AI errors
        if (parseErr.message && !parseErr.message.includes("JSON")) throw parseErr;
      }
    }
  }

  return { data: finalData, problemId };
}

export function evaluateAnswer({ question, studentAnswer, correctSolution }) {
  return request("/problem/evaluate", {
    method: "POST",
    body: JSON.stringify({ question, studentAnswer, correctSolution }),
  });
}

export function getProblemById(id) {
  return request(`/problem/${id}`, { method: "GET" });
}
