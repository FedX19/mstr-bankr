# Roaring Saylor

Stock-paired cultural meme — primary market denominated in tokenized MSTR exposure on Robinhood Chain.

> **We like the stock.**  
> A Bitcoin treasury meme, denominated in MSTR.  
> **The bid never sleeps.**

**Status: PRELAUNCH.** No official token is live. Do not purchase contracts claiming to represent this project until the official contract is published on this site.

## Product model

| Item | Value |
| --- | --- |
| Primary market | Roaring Saylor / Robinhood MSTR Stock Token |
| Chain | Robinhood Chain (chain ID `4663`) |
| Launch | Bankr fair launch — no presale, no creator allocation, no vesting |
| Fee beneficiary | Project multisig (subject to Bankr approval) |

This replaces the earlier plan to manually recycle a percentage of creator fees into MSTR purchases. Pool composition is dynamic and verifiable onchain. Holders have **no claim** on pool assets.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

Single source of truth: `src/lib/config.ts`.

| Field | Purpose |
| --- | --- |
| `launchStatus` | `research` \| `prelaunch` \| `cleared` \| `live` \| `paused` |
| `tradingEnabled` | Must stay `false` until launch gates clear |
| `quoteAssetKey` | `MSTR` (fallback: `COIN` → `PLTR` → `TSLA`) |
| `memeTokenAddress` | Official CA — `null` until launch |
| `poolAddress` / `poolId` | Pool identifiers after launch |
| `feeBeneficiary` | Public creator-fee wallet |
| `chain.*` | Robinhood Chain RPC, explorer, WETH, USDG |
| `stockTokens.*` | Canonical quote-asset addresses |

Changing `quoteAssetKey` re-points copy and dashboards without a redesign.

## Data layer

- `src/lib/data.ts` — dashboard model (null placeholders in prelaunch; no fabricated production values)
- `src/lib/adapters/robinhood-chain.ts` — RPC / pool reads (stub)
- `src/lib/adapters/bankr.ts` — public fee API (stub; confirm stock-pair fee docs first)
- `src/lib/adapters/chainlink.ts` — Stock Token oracle (stub)

## Site map

| Route | Content |
| --- | --- |
| `/` | Status bar, hero, live market placeholders, pool viz, mechanics, thesis, transparency, risks |
| `/how-it-works` | Buy/sell flow, pool ownership, fees, Stock Token disclosure |
| `/thesis` | Balanced MSTR bull/bear thesis |
| `/transparency` | Contracts, fees, verification checklist |
| `/risks` | Full risk categories + non-affiliation |
| `/faq` | Required FAQ set |

Trade UI is disabled until `launchStatus === "live"` and `tradingEnabled === true`.

## Launch gates (do not deploy the token until)

1. Written Bankr confirmation for stock-paired launch + fee routing  
2. Securities counsel memo  
3. Executable MSTR liquidity tests  
4. Security review  
5. Brand / trademark review  
6. Website readiness (this app in prelaunch mode)

## Tone

Serious financial / onchain dashboard: dark graphite, Bitcoin orange accent, monospaced stats. No cartoon clutter, no copied Strategy/Robinhood branding, no public-figure likeness.

## Deploy

```bash
npm run build
npm start
```

## Disclaimers

Not financial advice. Not affiliated with Strategy, Michael Saylor, Keith Gill, Robinhood Markets, Robinhood Assets (Jersey) Limited, Bankr or Doppler. Robinhood Stock Tokens are restricted in the United States and other jurisdictions. DYOR.
