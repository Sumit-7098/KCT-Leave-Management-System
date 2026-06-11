export async function adminLogout() {
  try {
    // Backend logout route clears httpOnly cookie.
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // ignore
  } finally {
    localStorage.removeItem("token");
  }
}

