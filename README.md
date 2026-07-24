# Roaring Saylor

Stock-paired cultural meme — primary market denominated in tokenized MSTR exposure on Robinhood Chain.

> **We like the stock.**  
> A Bitcoin treasury meme, denominated in MSTR.  
> **The bid never sleeps.**

**Status: PRELAUNCH (Phase 1 — public research).**  
No official token is live. Do not purchase contracts claiming to represent this project.

**Production:** https://mstr-bankr.vercel.app

---

## Product model

| Item | Value |
| --- | --- |
| Primary market | Roaring Saylor / Robinhood MSTR Stock Token |
| Chain | Robinhood Chain (chain ID `4663`) |
| Launch | Bankr fair launch — no presale, no creator allocation, no vesting |
| Fee beneficiary | Project multisig (subject to Bankr approval) |
| Working ticker | `$ROAR` (candidates: ROAR, SAYLOR, BID, STACK) |

Pool composition is dynamic and verifiable onchain. Holders have **no claim** on pool assets.

---

## Site map

| Route | Content |
| --- | --- |
| `/` | Hero, product identity, market, pool, mechanics, thesis, roadmap, transparency, risks |
| `/how-it-works` | Buy/sell, pool ownership, fees, Stock Token disclosure |
| `/thesis` | Balanced MSTR bull/bear thesis |
| `/roadmap` | Phases, hard gates, Bankr settings, fee policy, open questions |
| `/transparency` | Contracts, fees, verification, launch gate status |
| `/risks` | Full risk categories + non-affiliation |
| `/faq` | Product + launch FAQ |
| `/terms` | Terms of use |
| `/privacy` | Privacy policy |

Trade UI stays disabled until `launchStatus === "live"` and `tradingEnabled === true`.

---

## Roadmap (summary)

| Phase | Status | Meaning |
| --- | --- | --- |
| 0 Build & verify | **Complete** | Website + stock-paired product packaging |
| 1 Public research | **Current** | Site live without a token |
| 2 Clearance | Next | Bankr + counsel + liquidity + brand |
| 3 Token launch | Later | Human-approved Bankr deploy only |
| 4–6 Ops | Later | First day / week / ongoing |

### Hard gates

| Gate | Status |
| --- | --- |
| Website readiness | **Done** |
| Bankr confirmation | Human / pending |
| Securities counsel | Human / pending |
| Liquidity validation | Human / pending |
| Security review | In progress (ops) |
| Brand review | In progress (handles / counsel) |

**Do not deploy the token until every gate is done.**

Full detail: `/roadmap` and `src/lib/launch.ts`.

---

## Configure

Single source of truth: `src/lib/config.ts`.

| Field | Purpose |
| --- | --- |
| `launchStatus` | `research` \| `prelaunch` \| `cleared` \| `live` \| `paused` |
| `tradingEnabled` | Must stay `false` until launch gates clear |
| `quoteAssetKey` | `MSTR` (fallback: `COIN` → `PLTR` → `TSLA`) |
| `memeTokenAddress` | Official CA — `null` until launch |
| `poolAddress` / `poolId` | After launch |
| `feeBeneficiary` | Public creator-fee wallet |
| `officialX` | Project-owned handle when reserved |
| `brand.*` | Hero, token icon, MSTR mark paths |

Roadmap/gates/fee policy: `src/lib/launch.ts`.

---

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4

```bash
npm install
npm run dev
```

```bash
npm run build
npm start
```

---

## Operator checklist before token launch

1. Written Bankr answers to the 10 stock-pair questions in `/roadmap`
2. Securities counsel memo on file
3. Non-U.S. liquidity tests at $100 / $1k / $5k / $10k
4. Project entity + 2-of-3 hardware multisig labeled “Roaring Saylor Creator Fees”
5. Domain + X (and other socials) reserved and linked in config
6. Final ticker chosen after conflict / trademark checks
7. Security review signed off
8. On Transparency page: publish contract, pool, fee beneficiary, Bankr URL **before** any trade CTA
9. Human explicitly approves Bankr deployment
10. Flip config: `launchStatus: "live"`, `tradingEnabled: true` only after publish

---

## Disclaimers

Not financial advice. Not affiliated with Strategy, Michael Saylor, Keith Gill, Robinhood Markets, Robinhood Assets (Jersey) Limited, Bankr or Doppler. Robinhood Stock Tokens are restricted in the United States and other jurisdictions. DYOR.
