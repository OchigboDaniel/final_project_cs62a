import { useState, useEffect, useCallback } from "react";
import { Contract, isAddress } from "ethers";
import { POT_ADDRESS, ABI } from "./config";

export function usePot(signer) {
  const [pot, setPot] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");        // transaction errors
  const [loadError, setLoadError] = useState(""); // read/setup errors

  const refresh = useCallback(async () => {
    if (!signer) return;
    try {
      if (!isAddress(POT_ADDRESS)) {
        throw new Error("POT_ADDRESS in config.js is not a valid address");
      }
      const code = await signer.provider.getCode(POT_ADDRESS);
      if (code === "0x") {
        throw new Error("No contract found at POT_ADDRESS on this network. Check the address and that MetaMask is on Sepolia.");
      }

      const c = new Contract(POT_ADDRESS, ABI, signer);
      const [round, count, amount] = await Promise.all([
        c.currentRound(),
        c.contributionsCount(),
        c.contribution(),
      ]);
      const members = await Promise.all([0, 1, 2].map((i) => c.members(i)));
      const paid = await Promise.all(members.map((m) => c.hasPaid(round, m)));
      const balance = await signer.provider.getBalance(POT_ADDRESS);

      setPot({
        round,
        count,
        amount,
        members,
        paid,
        balance,
        turn: members[Number(round % 3n)],
      });
      setLoadError("");
    } catch (e) {
      console.error(e);
      setLoadError(e.shortMessage || e.message);
    }
  }, [signer]);

  useEffect(() => {
    if (!signer) return;
    refresh();

    // refresh on contract events, plus a slow poll as a fallback
    let c;
    try {
      c = new Contract(POT_ADDRESS, ABI, signer);
      c.on("Contributed", refresh);
      c.on("PaidOut", refresh);
    } catch (e) {
      console.error(e);
    }
    const timer = setInterval(refresh, 15000);

    return () => {
      clearInterval(timer);
      if (c) c.removeAllListeners();
    };
  }, [signer, refresh]);

  const send = async (fn, overrides) => {
    setBusy(true);
    setError("");
    try {
      const c = new Contract(POT_ADDRESS, ABI, signer);
      const tx = await c[fn](overrides);
      await tx.wait();
      await refresh();
    } catch (e) {
      console.error(e);
      setError(e.reason || e.shortMessage || e.message);
    } finally {
      setBusy(false);
    }
  };

  return {
    pot,
    busy,
    error,
    loadError,
    refresh,
    contribute: () => send("contribute", { value: pot.amount }),
    payout: () => send("payout"),
  };
}