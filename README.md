# Roaring Saylor

Public research dashboard for the **Roaring Saylor** thesis.

> **We like the stock.**  
> Strategy (MSTR) is a Bitcoin accumulation vehicle. Creator fees recycle into tokenized MSTR — public, trackable, compounding.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4

## Quick start

```bash
cd roaring-saylor
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configure after launch

Edit `src/lib/config.ts`:

| Field | Purpose |
| --- | --- |
| `contractAddress` | Token CA |
| `bankrUrl` | Bankr page |
| `xUrl` | X account |
| `githubUrl` | Repo |
| `explorerTxBase` | Tx explorer prefix |
| `strategy.*` | BTC holdings, short interest notes |
| `feeAllocationPct` | Default **60%** |

### Live stats & purchase log

`src/lib/data.ts` owns dashboard numbers:

- Pre-launch: zeros / `—` placeholders (`USE_DEMO_DATA = false`)
- Preview UI with sample buys: set `USE_DEMO_DATA = true`
- Production: implement real fetches inside `getDashboardData()` (token price, holders, fee totals, on-chain purchase list)

## Site map

| Route | Content |
| --- | --- |
| `/` | Hero, live stats, MSTR accumulation tracker, thesis panel, market context, roadmap |
| `/thesis` | Full written thesis |

## Business plan (unchanged)

1. Launch token (non-paired initially)
2. Collect creator fees
3. Allocate fixed % (60%) to tokenized MSTR
4. Publish every purchase
5. Optional later: stock-paired upgrade when Bankr liquidity allows
6. Own the “Roaring Saylor” narrative early

## Tone

Clean dark theme, high-contrast numbers, minimal fluff. Public research dashboard — not a hype landing page.

## Deploy

```bash
npm run build
npm start
```

Or connect the repo to Vercel / any Next host.

## Disclaimer

Not financial advice. Tokenized equity and crypto involve significant risk. DYOR.
