export function startGitHubOAuth(mode: "login" | "register") {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const redirectUri = "http://localhost:5173/oauth/github";
  const githubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email&state=${mode}`;

  window.location.href = githubLoginUrl;
}
