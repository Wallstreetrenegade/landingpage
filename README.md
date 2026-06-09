# Dr. Lead Flow — AI CEO Lab Funnel Pages

Live at: **aiceo.doctorleadflow.com**

## Pages

| File | Route | Description |
|------|-------|-------------|
| `optin.html` | `/` | Webinar opt-in — main landing page |
| `thank-you.html` | `/thank-you` | Webinar thank you — add to calendar |
| `apply.html` | `/apply` | Application funnel — VSL + form modal |
| `apply-thank-you.html` | `/apply/thank-you` | Post-application — GHL calendar booking |
| `apply-booked.html` | `/apply/booked` | Post-booking — offers (Skool, GHL, Viktor) |

## Funnels

**Webinar:** `/` → `/thank-you`  
**Application:** `/apply` → `/apply/thank-you` → `/apply/booked`

## Brand
- Dark bg: `#1A1210` | Oxblood: `#7A1E2E`
- Fonts: Playfair Display + DM Sans
- All CSS tokens in `:root` of each file

## Deploy
Deployed via Vercel. Push to `main` to update.

```bash
vercel --prod
```

## Diagrams
`diagrams/dlf-funnel-map.excalidraw` — open in Cursor/VS Code or drag to excalidraw.com
