document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("https://qfledge-1.onrender.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();
    // alert("Login successful");
    // Save the token and redirect to dashboard
    localStorage.setItem("token", data.token);
    window.location.href = "user-dashboard.html";
  } else {
    alert("Failed to login");
  }
});
