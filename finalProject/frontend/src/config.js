export const POT_ADDRESS = "0x56cB26a921F227e88d9406Edd17b5f48AB1d4CC8";
export const SEPOLIA_CHAIN_ID = 11155111n;

export const ABI = [
  "function contribution() view returns (uint256)",
  "function currentRound() view returns (uint256)",
  "function contributionsCount() view returns (uint256)",
  "function members(uint256) view returns (address)",
  "function hasPaid(uint256,address) view returns (bool)",
  "function contribute() payable",
  "function payout()",
  "event Contributed(address indexed member, uint256 indexed round)",
  "event PaidOut(address indexed recipient, uint256 amount, uint256 indexed round)",
];