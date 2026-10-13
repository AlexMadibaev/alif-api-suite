# Alif Acquiring — Sandbox Test Suite

Vercel-ready test site: static HTML and Node.js Serverless Functions.

## Features

- **WebCheckout**: `POST /api/webcheckout` builds a signed HTML form posting to the legacy `https://test-web.alif.tj/` Sandbox. The form accepts TJS 13 and Tajik numbers as 992900013307 or 900013307.
- **Callback**: `POST /api/callback` verifies a legacy HMAC callback. No transactions are stored.
- **Diagnostics**: `GET /api/health` reports configuration status without revealing any secrets.
- **Payments, Marketplace, Tokenization, Subscription**: safe request previews only. Real requests are disabled until official endpoint schemas and signing rules are verified.

## Deploy with Vercel

1. Import `AlexMadibaev/alif-api-suite` as a Vercel project (framework Other).
2. In **Settings → Environment Variables**, set `ALIF_TEST_KEY` and `ALIF_TEST_PASSWORD` to your Sandbox credentials from Alif. Keep them server-side and do not commit secrets.
3. Redeploy, open the project URL, check the **Diagnostics** tab, then test WebCheckout.
4. A browser POST to the Sandbox does not prove that Alif accepted the payment. Verify actual callbacks in Vercel runtime logs.

## Limitations

This is not production-ready: no persistent transaction state, authentication, idempotency, replay protection or end-to-end payment verification. Use only bank-provided test credentials and test card data. New Acquiring API reference pages were not accessible from this environment; do not treat the legacy protocol as their equivalent.

Documentation: https://docs.acquiring.alif.tj/payments/ , https://docs.acquiring.alif.tj/marketplace/ , https://docs.acquiring.alif.tj/tokenization/ , https://docs.acquiring.alif.tj/subscription/ .
