import React, { useEffect, useState } from "react";

const Wallet = () => {
  const [walletData, setWalletData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/mcp/wallet")
      .then((res) => res.json())
      .then((data) => setWalletData(data))
      .catch((error) => console.error("Error fetching wallet:", error));
  }, []);

  return (
    <div>
      <h2>Wallet</h2>
      {walletData ? (
        <div>
          <p>Balance: ₹{walletData.balance}</p>
          <h3>Transactions</h3>
          <ul>
            {walletData.transactions.map((txn, index) => (
              <li key={index}>{txn}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Wallet;
