import { formatEther } from "ethers";
import { useWallet } from "./useWallet";
import { usePot } from "./usePot";
import { POT_ADDRESS } from "./config";

const short = (a) => `${a.slice(0, 6)}...${a.slice(-4)}`;

export default function App() {
  const { signer, account, wrongNetwork, connect, switchToSepolia } = useWallet();
  const { pot, busy, error, loadError, refresh, contribute, payout } = usePot(signer);

  const wrap = { maxWidth: 520, margin: "2rem auto", fontFamily: "sans-serif", padding: "0 1rem" };

  if (!account) {
    return (
      <div style={wrap}>
        <h1>Ajo Savings Pot</h1>
        <button onClick={connect}>Connect MetaMask</button>
      </div>
    );
  }

  if (wrongNetwork) {
    return (
      <div style={wrap}>
        <h1>Ajo Savings Pot</h1>
        <p>You're on the wrong network.</p>
        <button onClick={switchToSepolia}>Switch to Sepolia</button>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={wrap}>
        <h1>Ajo Savings Pot</h1>
        <p style={{ color: "crimson" }}>Error: {loadError}</p>
        <button onClick={refresh}>Retry</button>
      </div>
    );
  }

  if (!pot) {
    return (
      <div style={wrap}>
        <h1>Ajo Savings Pot</h1>
        <p>Loading contract data...</p>
      </div>
    );
  }

  const idx = pot.members.findIndex((m) => m.toLowerCase() === account.toLowerCase());
  const isMember = idx !== -1;
  const iPaid = isMember && pot.paid[idx];
  const allPaid = pot.count === 3n;

  return (
    <div style={wrap}>
      <h1>Ajo Savings Pot</h1>
      <p>
        Connected: {short(account)} {isMember ? "(member)" : "(not a member)"}
      </p>
      <p>Contract: {short(POT_ADDRESS)}</p>
      <p>
        Round {(pot.round + 1n).toString()} · Contribution: {formatEther(pot.amount)} ETH
      </p>
      <p>Pot balance: {formatEther(pot.balance)} ETH</p>
      <p>
        Receiving this round: <b>{short(pot.turn)}</b>
      </p>

      <ul>
        {pot.members.map((m, i) => (
          <li key={m}>
            {short(m)} — {pot.paid[i] ? "✅ paid" : "⏳ pending"}
          </li>
        ))}
      </ul>

      <button onClick={contribute} disabled={busy || !isMember || iPaid}>
        {busy ? "Waiting..." : iPaid ? "Already paid" : "Contribute"}
      </button>{" "}
      <button onClick={payout} disabled={busy || !allPaid}>
        Payout
      </button>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}