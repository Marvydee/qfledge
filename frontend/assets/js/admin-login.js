// admin-login.js

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("admin-login-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = form.elements.email.value;
    const password = form.elements.password.value;

    try {
      const response = await fetch("http://localhost:3000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to login as admin");
      }

      const { token } = await response.json();
      localStorage.setItem("token", token);

      // Check if user is admin and redirect accordingly
      const isAdmin = true; // Replace with actual check (e.g., from JWT payload)
      if (isAdmin) {
        window.location.href = "../../public/admin.html";
      } else {
        window.location.href = "../../public/dashboard.html";
      }
    } catch (error) {
      console.error("Error logging in as admin:", error);
      alert("Failed to login as admin");
    }
  });
});
