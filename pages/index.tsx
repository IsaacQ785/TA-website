import Head from "next/head";

import Nav from "../components/Nav";
import OHLCChart from "./chart";
import styles from "../styles/Home.module.scss";
import Ticker from "../components/StockTicker";

export default function Home({ tickers }) {
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>

      <Nav />

      <main>
      </main>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  // get the current environment
  let dev = process.env.NODE_ENV !== "production";
  let { DEV_URL, PROD_URL } = process.env;

  // request posts from api
  let response = await fetch(`${dev ? DEV_URL : PROD_URL}/api/tickers`);
  // extract the data
  let data = await response.json();

  function unpack(rows, key) {
    return rows.map(function (row) {
      return row[key];
    });
  }

  const tickers = unpack(data.message, "Stock-ticker").sort();

  return {
    props: {
      tickers: tickers,
    },
  };
}
