document.addEventListener("DOMContentLoaded", function () {
  fetchUsers();
});

function fetchUsers() {
  const token = localStorage.getItem("token"); // Retrieve JWT token from localStorage

  fetch("http://127.0.0.1:3000/admin/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((users) => {
      renderUsers(users);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      // Handle error display or logging
    });
}

function renderUsers(users) {
  const userListElement = document.getElementById("userList");
  userListElement.innerHTML = ""; // Clear existing list

  users.forEach((user) => {
    const userElement = document.createElement("div");
    userElement.classList.add("user");

    const usernameElement = document.createElement("p");
    usernameElement.textContent = `Username: ${user.username}`;

    const emailElement = document.createElement("p");
    emailElement.textContent = `Email: ${user.email}`;

    userElement.appendChild(usernameElement);
    userElement.appendChild(emailElement);

    userListElement.appendChild(userElement);
  });
}
