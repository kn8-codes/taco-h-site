# Taco H — Website

Taco H LLC — authentic Mexican street food, Akron, Ohio. Static bilingual (EN/ES) site for the Taco H food truck.

## Live development loop
- `index.html` — home: today's stop + contact pods, map, full menu, social
- `menu.html` — full menu (QR landing; phone-first)
- `contact.html` — book-the-truck page
- `assets/css/taco.css` — single stylesheet; all brand tokens + modular skin live here (v10: uniform spacing, mobile-tested)
- `data/stop.json` — **single source for "Today's stop"** (edit one line when parked; map + card follow)
- `data/menu.json` — **single source for the menu** (site + QR read the same file)

## Run / preview locally
```bash
python3 -m http.server 8099
# open http://127.0.0.1:8099/
```

## Deploy
Vercel (like belt.works). Static build, `vercel.json` included (clean URLs + security headers). CLI deploy per the mesh `static-site-deploy-operations` skill; human-gated auth tap + public-path verification.

## Brand
- Mascot: opossum with sombrero holding a taco (crop of the menu-card art; assets in `assets/img/`)
- Palette: dark brown field, gold serif identity, brick/green accents — tokens in `taco.css`
- Bilingual EN/ES via `data-lang` toggle (`main.js`); Spanish QA via Kate/Jose

## Feature checklist
See `FEATURE_CHECKLIST.md` for full status (v10 — home page near-done; menu/contact share the same skin).

## License
Build files: MIT. Brand content (mascot art, menu, NAP): © Taco H LLC — do not reuse without permission.