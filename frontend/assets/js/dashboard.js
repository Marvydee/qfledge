document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM fully loaded and parsed");

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    // Fetch user coin amounts
    const userResponse = await fetch(
      "https://qfledge-1.onrender.com/user/coins",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user coin amounts");
    }

    const userCoins = await userResponse.json();
    console.log("User Coins:", userCoins);

    // Mapping symbols to CoinGecko IDs
    const symbolToId = {
      BTC: "bitcoin",
      ETH: "ethereum",
      USDT: "tether",
      DOGE: "dogecoin",
      BNB: "binancecoin",
      SOL: "solana",
      TRON: "tron",
      XRP: "ripple",
      // Add more mappings as needed
    };

    // Create a list of CoinGecko IDs from userCoins
    const coinIds = Object.keys(userCoins.coins)
      .map((symbol) => symbolToId[symbol])
      .join(",");

    // Fetch live coin prices and 24-hour change percentage from CoinGecko
    const pricesResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true`
    );

    if (!pricesResponse.ok) {
      throw new Error("Failed to fetch live coin prices and changes");
    }

    const livePrices = await pricesResponse.json();
    console.log("Live Prices:", livePrices);

    // Coin images paths
    const coinImages = {
      bitcoin:
        "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
      ethereum:
        "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
      tether:
        "https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663",
      dogecoin:
        "https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256",
      binancecoin:
        "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850",
      solana:
        "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422",
      tron: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png?1547035066",
      ripple:
        "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1605778731",
      // Add paths for other coins
    };

    // Calculate the total balance
    let totalBalance = 0;

    // Update the DOM with user amounts and live prices
    const coinPricesContainer = document.getElementById("coin-prices");
    coinPricesContainer.textContent = "";

    // Add header
    const header = document.createElement("h2");
    header.textContent = "Tokens";
    header.style.backgroundColor = "#181A20"; // Header row background color
    header.style.color = "#fff"; // Text color
    header.style.padding = "10px"; // Add some padding
    coinPricesContainer.appendChild(header);

    // Create table
    const table = document.createElement("table");
    table.className = "coin-table";
    table.style.backgroundColor = "#000"; // Black background color
    table.style.color = "#fff"; // White text color
    table.style.width = "100%"; // Set table width to 100% to make it wider

    // Add table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.style.backgroundColor = "#181A20"; // Header row background color
    headerRow.innerHTML = `
      <th>Coin</th>
      <th>Amount</th>
    `;
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Add table body
    const tbody = document.createElement("tbody");
    if (userCoins && userCoins.coins) {
      Object.keys(userCoins.coins).forEach((symbol) => {
        const userAmount = userCoins.coins[symbol];
        const coinId = symbolToId[symbol];
        const livePrice = livePrices[coinId]?.usd || 0;
        const totalValue = userAmount * livePrice;
        const changePercentage = livePrices[coinId]?.usd_24h_change || 0;

        // Add the total value to the total balance
        totalBalance += totalValue;

        const row = document.createElement("tr");
        row.style.marginBottom = "2px"; // Add margin bottom for each row

        row.innerHTML = `
          <td data-label="Coin">
            <img src="${
              coinImages[coinId] || "path/to/default.png"
            }" alt="${symbol}" style="width: 30px;">
            ${symbol}
            <div> $${livePrice.toFixed(2)}</div>
            <div style="color: ${
              changePercentage >= 0 ? "green" : "red"
            }"> ${changePercentage.toFixed(2)}%</div>
          </td>
          <td data-label="Amount">
            <div> ${userAmount}</div>
            <div> $${totalValue.toFixed(2)}</div>
          </td>
        `;

        tbody.appendChild(row);
      });
    } else {
      console.error("User coins data is not in expected format:", userCoins);
    }

    table.appendChild(tbody);
    coinPricesContainer.appendChild(table);

  const balanceElement = document.querySelector(".nftmax-amount__digit span");
if (balanceElement) {
  // Format the total balance with commas and '$' symbol
  const formattedBalance = totalBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  balanceElement.textContent = `$ ${formattedBalance}`;
} else {
  console.error("Balance element not found");
}
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
