# CiviRent – Civil Engineering Equipment Rentals

CiviRent is a Next.js application that lets infrastructure teams reserve high-uptime civil engineering equipment and complete secure payments through Razorpay. It showcases an equipment catalog, real-time availability, rental plan selection, and a full Razorpay order flow implemented with Next.js App Router APIs.

## ✨ Features

- **Equipment catalog** with search and category filters for earthmoving, concrete, surveying, material handling, and compaction assets.
- **Interactive booking flow** that captures project details, rental plan, and mobilization date before invoking the payment gateway.
- **Razorpay integration** via a serverless API route that creates orders securely using your Razorpay credentials.
- **Tailwind-powered UI** with responsive design, high-contrast callouts, and CTA overlays suited for Vercel deployments.

## 🚀 Quickstart

```bash
npm install
npm run dev
# visit http://localhost:3000
```

## 🔐 Environment Variables

Create a `.env.local` file (not committed) and set your Razorpay keys:

```bash
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx
```

On Vercel, add the same keys under **Project Settings → Environment Variables** and redeploy.

## 🧭 Razorpay Order Flow

- The client triggers `POST /api/payments/order` with the selected equipment, rental plan, and contact metadata.
- The API route uses the official `razorpay` Node SDK to create an order and returns the order id plus the publishable key.
- The frontend loads `checkout.js`, opens Razorpay Checkout, and handles success or failure callbacks with contextual messaging.

## 🛠️ Scripts

- `npm run dev` – start the development server.
- `npm run build` – create the production build.
- `npm start` – run the production server locally.
- `npm run lint` – run ESLint checks.

## 📦 Deployment

The project targets Vercel. After validating locally:

```bash
npm run build
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-7c6273cf
```

Wait a few seconds, then verify:

```bash
curl https://agentic-7c6273cf.vercel.app
```

CiviRent is now ready to support your next infrastructure rollout.
