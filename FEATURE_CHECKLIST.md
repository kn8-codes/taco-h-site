# TACO H WEBSITE — FEATURE CHECKLIST (durable, 2026-09-22)

Direction LOCKED 2026-09-22: **vintage style from real brand assets** — parchment bg (sampled menu card #f1d8ae), real opossum mascot in badge, folk-art border, Alfa Slab/Bebas/Rubik type, banner-style social bars. Mockup: `site/mockup_brand_v5_2026-09-22.png` (+ .html).

## Every feature ever asked — status

### Core (Nate's original three, this session)
- [x] Social feeds displayed — card band w/ links (IG @Taco_H_Akron, FB Taco H, TikTok TBD) — robust pattern chosen over flaky embeds
- [x] Map to locate the truck — Google embed + "Today's stop" card, single-source (`data/stop.json`)
- [x] Style matches the graphics/marketing/menu — v5 vintage, built from actual menu card + banner assets

### Packet requirements (2026-09-18) — carry through
- [x] Static-first, no CMS — skeleton built static; Vercel-ready
- [x] Bilingual EN/ES whole site — toggle implemented (R11; ES QA = Kate/Jose)
- [x] Menu via QR single-source — `data/menu.json` drives site menu page + QR (updated 09-22 w/ REAL menu from card)
- [x] Schedule presentation — chips + stop card; GPS ladder staged (static → phone share → LoRa)
- [ ] Menu/flyer/graphic assets — menu card + banner captured as assets; food photography backlog (truck shots)
- [ ] SEO basics — NAP consistent + LocalBusiness schema stub present; Google Business Profile setup (owner action)
- [ ] Ownership hygiene — domain NOT yet purchased (tacohakron.com AVAILABLE; register in LLC name); hosting creds documented at deploy
- [ ] Hosting/deploy — Vercel (like belt.works); mirror to private hardware later (Nate decision 09-22)

### Brainstorm adds (Egon, this session) — accepted
- [x] Today's stop one-file update — `data/stop.json`
- [x] Book-the-truck CTA (mailto + phone work today; form slot later)
- [ ] Pop-up news strip (short-term announcements; no newsletter needed early)
- [ ] Photo slots — kitchen line, truck, food (backlog)
- [ ] Ghost-brand note — "El Burrito" only as SEO history line if needed (decide at build)
- [ ] Clean URLs + security headers (`vercel.json` done)

### Design iteration (09-22) — locked
- [x] Brown/parchment bg from assets — menu parchment #f1d8ae sampled
- [x] Stamp badge evolution → real mascot in badge w/ gold ring (v5)
- [x] Type system — Alfa Slab One / Bebas Neue / Archivo Black / Rubik (v4–v5)

### Remaining work queue
1. Restyle live skeleton (index/menu/contact) to v5 tokens (in progress — Egon)
2. Kate's QA on ES copy + final palette blessing
3. Domain purchase (tacohakron.com, LLC registrant) → DNS → Vercel deploy
4. Google Business Profile setup (owner action w/ Kate sign-off)
5. Food/truck photos + social links fill (TikTok handle)
6. GPS MVP decision (static ok; phone-GPS later)
7. Mirror to private hardware when hosting ops mature
8. Final menu verification against operated menu before launch

## Grounding
Pricing/menu verifed from menu-card photo (09-18 email; re-read 09-22): mains 3/$12 & 1/$13, supreme +$1, meats 9 options, sides $4–5, drinks $1–3. NAP: 216-760-5828 · taco.h.akron@gmail.com · Akron OH · FB "Taco H" · IG @Taco_H_Akron.