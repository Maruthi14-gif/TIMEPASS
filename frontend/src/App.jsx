import { WallpaperProvider } from "./context/WallpaperContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@clerk/react";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    // Clerk handles auth state; no extra store is configured here.
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
          <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} replace />} />
          <Route
            path="/auth"
            element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace />}
          />
        </Routes>
        {/* <Toaster /> */}
      </WallpaperProvider>
    </ThemeProvider>
  );
}

export default App;