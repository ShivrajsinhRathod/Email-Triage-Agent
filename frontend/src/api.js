const API_BASE_URL = "http://127.0.0.1:8000";

export async function getTriageEmails(limit = 5) {
  const response = await fetch(
    `${API_BASE_URL}/triage?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch triage data");
  }

  return await response.json();
}