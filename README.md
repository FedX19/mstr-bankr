# Roaring Stacker

> **THE STACK NEVER STOPS.**  
> WE LIKE THE STOCK.  
> MSTR is the stock. Bitcoin is the stack.

**Ticker:** `$STACKR` · **Community:** The Stackers  
**Status:** Prelaunch · **Pair:** `$STACKR / tokenized MSTR` (pending Bankr approval)  
**Site:** https://mstr-bankr.vercel.app  
**Repo:** https://github.com/FedX19/mstr-bankr

## Homepage (short)

1. Status bar  
2. Hero  
3. One pool / one thesis  
4. MSTR–Bitcoin flywheel  
5. Mission scoreboard  
6. Short risk statement  
7. Footer  

Detail lives on **Thesis**, **Terminal**, and **Risks**.

## Config (`src/lib/config.ts`)

| Field | Initial |
| --- | --- |
| `projectName` | Roaring Stacker |
| `ticker` | STACKR |
| `launchStatus` | prelaunch |
| `tradingEnabled` | false |
| `chainName` / `chainId` | Robinhood Chain / 4663 |
| `quoteAssetKey` | MSTR |
| `pairStatus` | pending-bankr-approval |
| `fallbackPair` | WETH |

### Switch to WETH or USDG

If Bankr blocks the MSTR stock-token route:

1. Set `quoteAssetKey` to `"WETH"` or `"USDG"`
2. Set `pairStatus` to `"fallback"`
3. Optionally update mission milestone copy that mentions MSTR pool depth  

Do **not** evade Bankr geo / KYC / eligibility rules.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Safety

No token deploy, no trading activation, no fabricated market data in this repo.
