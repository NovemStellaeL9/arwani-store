# Design Direction: Arwani Store

## Identity & Purpose
Arwani Store (Arwani D'Gabriel Store) provides direct purchases for cellular data packages, card active periods (masa aktif), PLN electricity tokens, and digital vouchers in Indonesia. The interface connects directly to live supplier stock and ordering APIs.

## Audience
Indonesian consumers, resellers, and digital package buyers who value transparency, real-time stock availability, fast order fulfillment, and straightforward status tracking.

## Personality
Reliable, transparent, swift, and respectful. No artificial hype, no fake social proof, no invented claims.

## Dials
- **ENERGY**: 2 (Balanced. Direct and focused digital storefront)
- **RHYTHM**: 2 (Structured operator catalogs with clear live stock indicators)
- **MOTION**: 1 (Calm. Purposeful micro-interactions, modals, and tab switches without decorative animations)

## Color Palette
- Background: `#081225` (Dark default) / `#f8fafc` (Light mode)
- Surfaces / Cards: `#0f1d38` with subtle border `rgba(255, 255, 255, 0.12)` / `#ffffff` with border `rgba(15, 23, 42, 0.1)`
- Primary Action: `#2563eb` (Royal Blue)
- Success / Ready: `#10b981` (Emerald)
- Notice / Low Stock: `#f59e0b` (Amber)
- Error / Sold Out: `#ef4444` (Rose)
- Typography: Geist Sans for interface and Geist Mono for code/order IDs.

## Anti-Slop Constraints
1. No em dash characters (`\u2014`) in any written interface text.
2. No fake statistics, fabricated user counts, or fake reviews.
3. Every button, tab, and form input must have real, working logic.
4. Comprehensive UI states for every live endpoint: Loading, Empty, and Error.
5. High-contrast typography conforming to WCAG AA (minimum 4.5:1 ratio).
6. Accessible keyboard navigation with visible focus indicators.

