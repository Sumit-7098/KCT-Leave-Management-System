import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    // Auth is done via httpOnly cookie.
    // But in some setups token is also stored in localStorage.
    // We'll accept either a valid cookie (/me) OR a localStorage token presence.
    const check = async () => {
      try {
        const localToken = localStorage.getItem("token");
        if (localToken) {
          setIsAuthed(true);
          setChecking(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });
        setIsAuthed(res.ok);
      } catch {
        setIsAuthed(false);
      } finally {
        setChecking(false);
      }
    };

    check();
  }, []);


  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-[#2354A2] font-semibold">Checking authentication...</div>
      </div>
    );
  }

  if (!isAuthed) return <Navigate to="/login" replace />;

  return children;
}

