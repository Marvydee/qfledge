document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM fully loaded and parsed");

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    // Fetch user coin amounts
    const userResponse = await fetch("https://qfledge-1.onrender.com/user/coins", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user coin amounts");
    }

    const userCoins = await userResponse.json();
    console.log("User Coins:", userCoins);
    // Coin images paths
    const coinImages = {
      BTC: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
      ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
      USDT: "https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663",
      DOGE: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256",
      BNB: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850",
      SOL: "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422",
      TRON: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png?1547035066",
      XRP: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1605778731",
      // Add paths for other coins
    };

    // Update the DOM with user amounts
    const coinPricesContainer = document.getElementById("coin-prices");
    coinPricesContainer.textContent = "";

    // Create table and headers
    const table = document.createElement("table");
    table.className = "coin-table"; // Add a class for styling
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = "<th>Tokens</th><th>Amount</th>";
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    if (userCoins && userCoins.coins) {
      Object.keys(userCoins.coins).forEach((symbol) => {
        const userAmount = userCoins.coins[symbol];
        const row = document.createElement("tr");

        // Image element for the coin
        const coinImage = document.createElement("img");
        coinImage.src = coinImages[symbol] || "path/to/default.png";
        coinImage.alt = symbol;
        coinImage.style.width = "20px"; // Set a width for the image

        const tokenCell = document.createElement("td");
        tokenCell.appendChild(coinImage);
        tokenCell.innerHTML += ` ${symbol}`;

        const amountCell = document.createElement("td");
        amountCell.textContent = userAmount;

        row.appendChild(tokenCell);
        row.appendChild(amountCell);
        tbody.appendChild(row);
      });
    } else {
      console.error("User coins data is not in expected format:", userCoins);
    }

    table.appendChild(tbody);
    coinPricesContainer.appendChild(table);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
