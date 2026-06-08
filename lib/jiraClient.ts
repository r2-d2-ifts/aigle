const JIRA_SERVER = process.env.JIRA_SERVER ?? "";
const JIRA_LOGIN = process.env.JIRA_LOGIN ?? "";
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN ?? "";
const JIRA_PROJECT = process.env.JIRA_PROJECT ?? "TUDS";

const auth = Buffer.from(`${JIRA_LOGIN}:${JIRA_API_TOKEN}`).toString("base64");

async function jiraFetch(path: string) {
  const res = await fetch(`${JIRA_SERVER}/rest/api/2/${path}`, {
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Jira ${res.status}: ${path}`);
  return res.json();
}

export async function getBacklog() {
  const data = await jiraFetch(
    `search?jql=project=${JIRA_PROJECT} AND sprint in openSprints() AND status=Backlog&maxResults=50&fields=summary,description,story_points,issuetype,labels,components,status`
  );
  return data.issues ?? [];
}

export async function getSprints() {
  const data = await jiraFetch(
    `search?jql=project=${JIRA_PROJECT}&maxResults=5&fields=sprint`
  );
  return data.issues ?? [];
}

export async function getVelocity() {
  const data = await jiraFetch(
    `search?jql=project=${JIRA_PROJECT} AND sprint in closedSprints() ORDER BY created DESC&maxResults=50&fields=story_points,status,sprint`
  );
  return data.issues ?? [];
}

export function isConfigured() {
  return Boolean(JIRA_SERVER && JIRA_LOGIN && JIRA_API_TOKEN);
}
