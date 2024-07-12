const BASE_URL = "https://qsdapps.onrender.com";

async function register(username, email, passcode) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, passcode }),
  });

  if (!response.ok) {
    if (response.status == 409) {
      const { error } = await response.json();
      return alert(error || "Similar credentials already exist");
    }

    return alert("Unable to complete action");
  }

  const { token } = await response.json();
  localStorage.setItem("token", token);
  window.location.href = "index.html";
}

async function login(email, passcode) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, passcode }),
  });

  if (!response.ok) {
    if (response.status == 409) return alert("Incorrect credentials");
    return alert("Unable to complete action");
  }

  const { token } = await response.json();
  localStorage.setItem("token", token);
  window.location.href = "index.html";
}

async function getLoggedInUserInfo() {
  const token = window.localStorage.getItem("token");
  if (!token) return undefined;

  const response = await fetch(`${BASE_URL}/whoami`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return undefined;

  return await response.json();
}

// { username, passcode, email }
async function updateUserInfo(obj) {
  const token = window.localStorage.getItem("token");
  if (!token) return alert("You must be logged in to update info");

  const response = await fetch(`${BASE_URL}/user`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  if (!response.ok) return alert("Unable to complete request");
}

async function getCoins() {
  const token = window.localStorage.getItem("token");
  if (!token) return alert("You must be logged in to get live prices");

  const response = await fetch(`${BASE_URL}/coins`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) return null;
  return await response.json();
}

async function getSingleCoin(symbol) {
  const token = window.localStorage.getItem("token");
  if (!token) return alert("You must be logged in to get live prices");

  const response = await fetch(`${BASE_URL}/coins/${symbol}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) return null;
  return await response.json();
}

const API_BASE_URL = "https://qsdapps.onrender.com";
const token = "btc";

async function getCoins() {
  const response = await fetch(`${API_BASE_URL}/coins`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to load coin data:", response.statusText);
    return;
  }

  const coins = await response.json();
  displayCoins(coins);
}

function displayCoins(coins) {
  const coinsContainer = document.getElementById("coinsContainer");
  coinsContainer.innerHTML = ""; // Clear previous content

  coins.forEach((coin) => {
    const coinElement = document.createElement("div");
    coinElement.className = "coin";
    coinElement.innerHTML = `
      <div class="nftmax-newtrans__info">
        <div class="nftmax-newtrans__icon"><img src="assets/img/${coin.symbol.toLowerCase()}-icon.png" alt="${
      coin.symbol
    }"></div>
        <h4 class="nftmax-newtrans__added">$${coin.price}<span>${
      coin.change
    }%</span></h4>
      </div>
      <div class="nftmax-balance-amount nftmax-newtrans__amount">
        <h4 class="nftmax-balance-amount" style="color: #fff;"><b>${
          coin.amount
        } ${coin.symbol}</b></h4>
        <p class="nftmax-balance__sub"><span class="nftmax-newtrans__credit">$${
          coin.value
        }</span></p>
      </div>
    `;
    coinsContainer.appendChild(coinElement);
  });
}

// Call the function to fetch and display coins when the page loads
document.addEventListener("DOMContentLoaded", getCoins);
