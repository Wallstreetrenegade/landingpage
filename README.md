# PERGA Product + Opportunity Funnel

A two-page awareness funnel for PERGA's Core 4 wellness system and Legacy Partner opportunity.

## Visitor journey

1. `optin.html` (`/`) — product/opportunity overview and registration modal.
2. `thank-you.html` (`/thank-you`) — personalized presentation page, supplied video, next steps and share link.

Vercel's clean URL rules live in `vercel.json`. The landing-page opt-in submits through `/api/perga-optin`, which establishes a valid PERGA session and sends the lead to PERGA's official `save-overview-lead` endpoint with `pillar_customer_id=2394` and `referred_by=joshuaboyd`. After PERGA confirms the record, the visitor advances to our `/thank-you` webinar page.

## Preview locally

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000/optin.html`.

## Brand system

- Deep navy: `#00151f`
- PERGA navy: `#003344`
- Aqua: `#68cbd0`
- Cream: `#f5f2eb`
- Type: Manrope + DM Sans

All production assets are in `assets/`. Source reference documents are retained in `pdf-docs-images/`.

## Before production launch

- Connect the registration form to the chosen CRM/email workflow.
- Confirm final presentation video and hosting strategy.
- Add analytics and advertising pixels.
- Confirm the final legal/privacy URLs and compliance copy with PERGA.
- Replace the general follow-up instruction with the inviter's desired CTA or calendar flow.
- Run final performance and cross-browser QA after assets are locked.

## Deployment

This remains a static Vercel project:

```powershell
vercel --prod
```
