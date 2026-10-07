# Happzy Merch — Railway Ready

A Railway-ready Node/Express storefront for Happzy, with the Twitch channel linked at https://www.twitch.tv/happzy.

## Files

- `index.html` — storefront
- `style.css` — responsive design
- `script.js` — products + cart
- `server.js` — Express server
- `package.json` — Node dependency/start command
- `railway.json` — Railway deployment configuration
- `.gitignore`
- `.env.example`

## Railway

Deploy the repository through Railway's GitHub integration.

The included configuration uses:

- Builder: Railpack
- Start command: `npm start`
- Health check: `/health`
- Node: 20+
- Port: Railway's automatically supplied `$PORT`

No custom PORT variable is required.

## Local

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Before launch

Replace sample products/artwork with Happzy-approved designs, add real social links, add actual shipping/returns/privacy/terms, and connect a real checkout/fulfillment provider.

Only use Happzy branding, artwork, and likeness with appropriate permission.
