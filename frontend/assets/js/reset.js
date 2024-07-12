document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("newPassword").value;

    fetch("http://127.0.0.1:3000/user/reset-password", {
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
        alert("Password reset successfully");
      })
      .catch((error) => {
        console.error("Error resetting password:", error);
        alert("Failed to reset password");
      });
  });
