import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// The API lives on a different domain than the app, so Clerk's __session cookie
// is not sent with these requests. Attach the session token explicitly instead.
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = await window.Clerk?.session?.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (error) {
    console.error("Failed to attach Clerk token:", error);
  }

  return config;
});
