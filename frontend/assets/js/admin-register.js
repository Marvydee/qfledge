document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("admin-register-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = form.elements.username.value;
    const email = form.elements.email.value;
    const password = form.elements.password.value;

    try {
      const response = await fetch("http://localhost:3000/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to register admin");
      }

      alert("Admin registered successfully");
      window.location.href = "admin-login.html"; // Redirect to admin login page
    } catch (error) {
      console.error("Error registering admin:", error);
      alert("Failed to register admin");
    }
  });
});
