# Veltrix Markets

Veltrix Markets is a responsive, browser-based stock trading dashboard built with React and Vite. Explore a sample market, review a demo portfolio, manage a watchlist, and try simulated buy and sell orders in one interface.

> **Demo only:** Prices, portfolio values, alerts, and account details are sample data. Trades are simulated in the browser; there is no brokerage connection, live market feed, real account, or persistent trade storage. This app is for demonstration and learning, not investment advice.

## Features

- **Overview:** Portfolio summary, performance chart, market indices, watchlist, top movers, and holdings.
- **Markets:** Browse sample stocks, filter the list, inspect quote details, and open the trade dialog.
- **Portfolio:** Review the sample holdings, allocation, and portfolio metrics.
- **Activity:** View orders generated during the current session.
- **Watchlist:** Add or remove supported sample stocks.
- **Responsive interface:** Dashboard layouts adapt to desktop, tablet, and mobile screens.

The included stock universe is NVDA, AAPL, TSLA, MSFT, AMZN, and META. The displayed quotes and chart series are hard-coded examples rather than current market data.

## Get started

### Requirements

- Node.js (current LTS recommended)
- npm

### Install and run

```sh
npm install
npm run dev
```

Vite prints a local URL in the terminal, usually `http://localhost:5173`. Open it in a browser to use the dashboard.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reload. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally. Run the build first. |
| `npm run lint` | Check the source with ESLint. |

## Built with

- React 19
- Vite 8
- Tailwind CSS 4 (Vite integration)
- ESLint

## Project structure

```text
src/
  App.jsx       Dashboard pages, sample data, and interactive demo flows
  App.css       Dashboard component and responsive styles
  index.css     Global styles
  main.jsx      React application entry point
  assets/       Images and bundled visual assets
public/         Static icons and favicon
```

## Customization

Sample stocks and quote details are defined near the top of `src/App.jsx`. The dashboard currently uses local in-memory state, so changes to the watchlist and trade activity reset when the page is refreshed. To turn this demo into a live product, connect it to a trusted market-data provider and a properly secured brokerage and account service; do not treat the sample values as live quotes.
