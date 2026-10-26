import { useState, useEffect, useCallback } from "react";
import { BrowserProvider } from "ethers";
import { SEPOLIA_CHAIN_ID } from "./config";

export function useWallet() {
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);

  const connect = useCallback(async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();
    setWrongNetwork(network.chainId !== SEPOLIA_CHAIN_ID);
    const s = await provider.getSigner();
    setSigner(s);
    setAccount(await s.getAddress());
  }, []);

  const switchToSepolia = () =>
    window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }],
    });

  useEffect(() => {
    if (!window.ethereum) return;
    const onAccounts = () => connect();
    const onChain = () => window.location.reload();
    window.ethereum.on("accountsChanged", onAccounts);
    window.ethereum.on("chainChanged", onChain);
    return () => {
      window.ethereum.removeListener("accountsChanged", onAccounts);
      window.ethereum.removeListener("chainChanged", onChain);
    };
  }, [connect]);

  return { signer, account, wrongNetwork, connect, switchToSepolia };
}