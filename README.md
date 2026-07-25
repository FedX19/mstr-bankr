# Roaring Stacker

> **WE LIKE THE STOCK.**  
> MSTR is the stock. Bitcoin is the stack.  
> The stock can restart the stack.

Independent Bitcoin-native cultural meme built around the thesis that a recovery in MSTR **could** help reactivate Strategy’s capital engine and contribute to Bitcoin’s next major move.

**Community:** The Stackers  
**Working ticker:** `$STACKR`  
**Status:** Prelaunch — no official token  
**Site:** https://mstr-bankr.vercel.app  
**Repo:** https://github.com/FedX19/mstr-bankr

## Core config

Edit `src/lib/config.ts` — single source of truth:

| Field | Value |
| --- | --- |
| `projectName` | Roaring Stacker |
| `ticker` | STACKR |
| `communityName` | The Stackers |
| `primarySlogan` | WE LIKE THE STOCK. |
| `thesisLine` | MSTR is the stock. Bitcoin is the stack. |
| `catalystLine` | The stock can restart the stack. |
| `launchStatus` | `"prelaunch"` |
| `tradingEnabled` | `false` |

## Thesis (summary)

The market may be underestimating the relationship between MSTR, Strategy’s access to capital, and future Bitcoin demand.

Potential flywheel (thesis, not a guarantee):

MSTR Strength → Access to Capital → Potential BTC Purchases → Bitcoin Demand → BTC Appreciation → MSTR Asset Value → (back)

A higher MSTR price does **not** automatically cause Strategy to raise capital or buy Bitcoin.

## Proposed market

**Roaring Stacker / tokenized MSTR**

- Buy: tokenized MSTR enters the pool; Roaring Stacker leaves it  
- Sell: Roaring Stacker enters the pool; tokenized MSTR leaves it  
- MSTR balance is dynamic — not a permanent treasury  
- Holders do **not** own pool MSTR  
- Token is **not** backed by MSTR  
- Pair **not yet confirmed** — subject to platform and legal approval  

## What we do not claim

- No permanent fee-funded MSTR accumulation  
- No MSTR-backed token  
- No creator-fee price floor  
- No holder claim on a reserve  
- No “every buy buys shares / forces Robinhood buys”  
- No coordinated squeeze narrative  

## Stack

- Next.js (App Router) · TypeScript · Tailwind CSS v4

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Brand

Treasury Lion mascot, red headband, orange eyes, dark command-center artwork, mobile crop, token icon, vault background — orange/graphite design system under `/public/brand`.

## Safety

Do not deploy a token, invent financial data, or publish a contract from this repo without human approval. Research figures require a source and date or display “Data source pending.”

## Disclaimer

Not financial advice. Not affiliated with Strategy, Michael Saylor, Keith Gill, Robinhood Markets, Robinhood Assets (Jersey) Limited, Bankr or Doppler. DYOR.
