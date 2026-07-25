/**
 * Beginner buy/swap guide — consumer language only.
 * Execution happens on Bankr; this site never holds funds or asks for keys.
 */

import { siteConfig } from "./config";

export const buyReadiness = [
  {
    id: "wallet",
    title: "A crypto wallet",
    body: "An app that holds crypto and lets you approve trades. Popular options include Robinhood Wallet, MetaMask, Rainbow, and Coinbase Wallet.",
    tip: "Never share your seed phrase or recovery words with anyone — including this site.",
  },
  {
    id: "network",
    title: "Robinhood Chain",
    body: `${siteConfig.projectName} trades on ${siteConfig.chainName} (chain ID ${siteConfig.chainId}). Your wallet must be set to this network before you swap.`,
    tip: "Robinhood Wallet supports this network natively. Other wallets can add it with one click below.",
  },
  {
    id: "gas",
    title: "A little ETH for gas",
    body: "Every onchain trade needs a small network fee paid in ETH on Robinhood Chain. Keep a small amount of ETH so your swap can go through.",
    tip: "Gas is separate from the amount you spend on $STACKR.",
  },
  {
    id: "trade",
    title: "Something to swap",
    body: `The primary market pairs $${siteConfig.ticker} with tokenized MSTR. On Bankr you will swap supported assets for $${siteConfig.ticker} according to what the pool accepts.`,
    tip: "Exact swap routes and balances are shown inside Bankr — not on this site.",
  },
] as const;

export const buySteps = [
  {
    n: 1,
    title: "Confirm you’re eligible",
    body: "Tokenized stock markets are restricted in the U.S. and other places. Only continue if the rules allow you to participate.",
  },
  {
    n: 2,
    title: "Verify the official contract",
    body: "Scammers copy names and logos. Always match the contract address on this site before you buy.",
  },
  {
    n: 3,
    title: "Set up wallet + network",
    body: "Install a wallet, open Robinhood Chain, and keep a little ETH for fees.",
  },
  {
    n: 4,
    title: "Buy on Bankr",
    body: `Complete the swap on Bankr — the official trading interface for this token. This site never takes custody of your funds.`,
  },
] as const;

export const beginnerFaqs = [
  {
    q: "Do I need to know how DeFi works?",
    a: "No. Follow the steps: wallet → correct network → verify contract → buy on Bankr. Go slow and double-check addresses.",
  },
  {
    q: "Will this site take my money?",
    a: "No. We never ask for seed phrases, never hold your crypto, and never execute the swap ourselves. Bankr (or another wallet you choose) handles the trade.",
  },
  {
    q: "What if I’m in the United States?",
    a: "Tokenized MSTR products are not available to U.S. persons. Do not try to bypass location checks. Educational pages on this site are still free to read.",
  },
  {
    q: "Why might my estimated amount differ on Bankr?",
    a: "Prices move constantly and pools have fees and slippage. The estimate here is a rough guide only. Trust the quote Bankr shows before you confirm.",
  },
] as const;

export const robinhoodChainWalletParams = {
  chainId: `0x${siteConfig.chain.chainId.toString(16)}`, // 0x1237 = 4663
  chainName: siteConfig.chain.chainName,
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: [siteConfig.chain.rpcUrl],
  blockExplorerUrls: [siteConfig.chain.explorerUrl],
} as const;
