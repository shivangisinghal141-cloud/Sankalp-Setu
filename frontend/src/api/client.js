const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API ${response.status}: ${errText}`);
  }
  return response.json();
}

export const sankalpApi = {
  getIssues: () => request('/api/v1/issues'),
  trackIssue: (query) => request(`/api/v1/issues/track/${encodeURIComponent(query)}`),
  submitComplaintWebhook: (payload) =>
    request('/api/v1/complaints/webhook', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  advanceIssueAction: (issueId, payload) =>
    request(`/api/v1/issues/${encodeURIComponent(issueId)}/action`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getUniversityProjects: () => request('/api/v1/university/projects'),
  getUniversityChallenges: () => request('/api/v1/university/challenges'),
  submitUniversityProposal: (payload) =>
    request('/api/v1/university/proposals', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getCsrOpportunities: () => request('/api/v1/csr/opportunities'),
  submitCsrPledge: (payload) =>
    request('/api/v1/csr/pledges', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getStats: () => request('/api/v1/analytics/stats'),
  getNotifications: () => request('/api/v1/notifications'),
  adminLogin: (username, password) =>
    request('/api/v1/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
};
