document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const messageDiv = document.getElementById("message");
    messageDiv.style.display = "block";

    if (response.ok) {
      messageDiv.textContent = "Registration successful";
      messageDiv.className = "success";
      setTimeout(() => {
        window.location.href = "load-login.html"; // Replace with the actual login page URL
      }, 2000); // Redirect after 2 seconds
    } else {
      const errorData = await response.json();
      messageDiv.textContent = `Failed to register user: ${
        errorData.message || response.statusText
      }`;
      messageDiv.className = "error";
    }
  });
