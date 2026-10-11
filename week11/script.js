const RECIPIENT = "0x000000000000000000000000000000000000dEaD"; // 2nd wallet
const message = document.getElementById("message");
let signer;


// CONNECT
document.getElementById("connectBtn").onclick = async () => {
    if (!window.ethereum) {
        message.textContent = "MetaMask not found. Please install it.";
        return;
    }
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();

        const network = await provider.getNetwork();
        if (network.chainId !== 11155111) {
            message.textContent = "Wrong network. Switch MetaMask to Sepolia and reconnect.";
            return;
        }

        document.getElementById("account").textContent = await signer.getAddress();
        const balance = await signer.getBalance();
        document.getElementById("balance").textContent = ethers.utils.formatEther(balance) + " ETH";
        document.getElementById("sendBtn").disabled = false;
        message.textContent = "Connected to Sepolia.";
    } catch (err) {
        if (err.code === 4001 || err.code === "ACTION_REJECTED") {
            message.textContent = "Connection cancelled. You rejected the request.";
        } else {
            message.textContent = "Error: " + (err.reason || err.message);
        }
    }
};


// SEND
document.getElementById("sendBtn").onclick = async () => {
    try {
        message.textContent = "Confirm the transaction in MetaMask...";
        const tx = await signer.sendTransaction({
            to: RECIPIENT,
            value: ethers.utils.parseEther("0.001")
        });
        message.textContent = "Sent! Waiting for confirmation. Hash: " + tx.hash;
        await tx.wait();
        message.textContent = "Success! Transaction hash: " + tx.hash;
    } catch (err) {
        if (err.code === 4001 || err.code === "ACTION_REJECTED") {
            message.textContent = "Transaction cancelled. You rejected the request.";
        } else {
            message.textContent = "Error: " + (err.reason || err.message);
        }
    }
};