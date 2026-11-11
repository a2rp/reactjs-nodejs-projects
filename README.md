# React and Node.js project examples

A collection of five independent full-stack and frontend examples. Each folder has its own backend and/or frontend dependencies, so install and run the projects separately.

## Projects

| Folder | Example |
| --- | --- |
| `app1-node-react-connectivity` | React calls a small Express API and displays its response. |
| `app2-stripe-payment-system` | React cart and server-created Stripe Checkout Sessions using a fixed sample catalog. |
| `app3-website-language-change` | React language switcher with English and Hindi translations. The two frontend folders are equivalent copies. |
| `app4-hospital-management` | MongoDB CRUD demo for doctors, patients, and appointments. |
| `app5-event-management` | MongoDB event CRUD demo with reminder toggles. |

## Requirements

- Node.js 20.19 or newer and npm
- MongoDB running locally or a MongoDB connection string for apps 4 and 5
- Stripe test-mode API credentials for app 2

Each app uses port `1198` for its backend and port `3000` for its Vite frontend by default. Run one example at a time, or set a different `PORT` for concurrent backends.

## Run an example

For apps 1, 2, 4, and 5, open two terminals. In the backend folder for the chosen app:

```sh
npm install
npm run start:dev
```

Then in that app's frontend folder:

```sh
npm install
npm run dev
```

App 3 is frontend-only. Choose `frontend1` or `frontend - Copy`, then run `npm install` and `npm run dev` there.

### Stripe setup (app 2)

Copy `app2-stripe-payment-system/backend/.env.example` to `.env` and set your Stripe **test** secret and webhook signing secret. The frontend API URL can be changed with `VITE_API_BASE_URL` in its `.env`. Configure a local HTTPS tunnel and Stripe webhook endpoint at `/api/webhooks/stripe` when trying webhook signature validation.

This sample validates webhook signatures and displays Checkout Session payment status. It has no durable order store or fulfillment workflow. Use Stripe test mode only, and do not use the redirect page alone to fulfill real orders.

### MongoDB setup (apps 4 and 5)

Copy the backend `.env.example` to `.env` if you need a different database URL or frontend origin. Start MongoDB before starting the API. These are local CRUD demonstrations with no authentication, authorization, or production privacy controls. Use generated demo records only; do not enter real patient or personal data.

## Security and scope

These examples are learning projects, not production services. The Stripe example uses a fixed server-side sample catalog and test credentials. The hospital and event demos are unauthenticated CRUD apps intended for local use.

## Links

- Portfolio: [ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [a2rp](https://github.com/a2rp)
- CodePen: [ash1198](https://codepen.io/ash1198)
- LinkedIn: [aashishranjan](https://www.linkedin.com/in/aashishranjan)
- YouTube: [Ashish Ranjan](https://www.youtube.com/@ashishranjan-ashz)
- Support: [Buy Me a Coffee](https://buymeacoffee.com/a2rp) | [Patreon](https://patreon.com/a2rp)