document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("newPassword").value;

    fetch("https://qfledge-1.onrender.com/user/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Optionally, include other headers like Authorization if needed
      },
      body: JSON.stringify({ email, newPassword }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        console.log("Password reset successfully:", data);

        // Display success message
        document.getElementById("message").textContent =
          "Password reset successfully";
        document.getElementById("message").style.color = "green";

        if (data.userType === "admin") {
          window.location.href = "admin-login.html";
        } else {
          window.location.href = "load-login.html";
        }
      })
      .catch((error) => {
        console.error("Error resetting password:", error);

        // Display error message
        document.getElementById("message").textContent =
          "Failed to reset password: " + error.message;
        document.getElementById("message").style.color = "red";
      });
  });
