document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "admin-login.html";
    return;
  }

  const checkAdminStatus = async () => {
    try {
      const response = await fetch(
        "https://qfledge-1.onrender.com/user/check-admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("User is not authorized as admin");
      }

      // Proceed to load admin dashboard
    } catch (error) {
      console.error("Error checking admin status:", error);
      window.location.href = "admin.html";
    }
  };

  checkAdminStatus();
});
