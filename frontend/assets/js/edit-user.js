document.addEventListener("DOMContentLoaded", function () {
  fetchUsers();

  // Get the modal
  const modal = document.getElementById("dialog");

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  // Handle form submission
  const form = document.getElementById("editUserForm");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const userId = form.dataset.userId; // Get the user ID
    const username = form.username.value;
    const email = form.email.value;
    const balance = form.balance.value;

    const btc = form.btc.value;
    const eth = form.eth.value;
    const usdt = form.usdt.value;
    const doge = form.doge.value;
    const bnb = form.bnb.value;
    const sol = form.sol.value;
    const tron = form.tron.value;
    const xrp = form.xrp.value;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://qfledge-1.onrender.com/admin/user/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, balance }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      const coinResponse = await fetch(
        `https://qfledge-1.onrender.com/admin/user/${userId}/coins`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ btc, eth, usdt, doge, bnb, sol, tron, xrp }),
        }
      );

      if (!coinResponse.ok) {
        throw new Error("Failed to update user coins");
      }

      document.getElementById("feedback").textContent =
        "User updated successfully";
      fetchUsers(); // Refresh the user list
      modal.style.display = "none"; // Close the modal
    } catch (error) {
      document.getElementById("feedback").textContent =
        "Error updating user: " + error.message;
    }
  });
});

function fetchUsers() {
  const token = localStorage.getItem("token");

  fetch("https://qfledge-1.onrender.com/admin/users", {
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
    });
}

function renderUsers(users) {
  const userListElement = document.getElementById("userList");
  userListElement.innerHTML = "";

  users.forEach((user) => {
    const userElement = document.createElement("div");
    userElement.classList.add("user");

    const usernameElement = document.createElement("p");
    usernameElement.textContent = `Username: ${user.username}`;

    const emailElement = document.createElement("p");
    emailElement.textContent = `Email: ${user.email}`;

    const balanceElement = document.createElement("p");
    balanceElement.textContent = `Balance: ${user.balance}`;

    const coinsElement = document.createElement("p");
    coinsElement.textContent = `Coins: BTC: ${user.coins.BTC}, ETH: ${user.coins.ETH}, USDT: ${user.coins.USDT}, DOGE: ${user.coins.DOGE}, BNB: ${user.coins.BNB}, SOL: ${user.coins.SOL}, TRON: ${user.coins.TRON}, XRP: ${user.coins.XRP}`;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => openEditForm(user));

    userElement.appendChild(usernameElement);
    userElement.appendChild(emailElement);
    userElement.appendChild(balanceElement);
    userElement.appendChild(coinsElement);
    userElement.appendChild(editButton);

    userListElement.appendChild(userElement);
  });
}

function openEditForm(user) {
  const form = document.getElementById("editUserForm");
  form.username.value = user.username;
  form.email.value = user.email;
  form.balance.value = user.balance;
  form.btc.value = user.coins.BTC;
  form.eth.value = user.coins.ETH;
  form.usdt.value = user.coins.USDT;
  form.doge.value = user.coins.DOGE;
  form.bnb.value = user.coins.BNB;
  form.sol.value = user.coins.SOL;
  form.tron.value = user.coins.TRON;
  form.xrp.value = user.coins.XRP;
  form.dataset.userId = user._id; // Store the user ID in a dataset attribute

  const modal = document.getElementById("dialog");
  modal.style.display = "flex"; // Set display to flex to center the modal
}
