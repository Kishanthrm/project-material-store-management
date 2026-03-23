export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.clear();
    window.location.href = "/";
    return;
  }

  return response;
};