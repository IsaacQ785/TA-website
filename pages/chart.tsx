import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Head from 'next/head'
import unpack from "../helper/unpack"
import StockSearchBar from "../components/chart components/stockSearch"
import StockPlot from "../components/chart components/stockPlot"

export interface StockData {
  Date: string[];
  close: number[];
  Volume: number[];
  Open: number[];
  High: number[];
  Low: number[];
}
const default_ticker = "AAPL"

const ChartPage = (props) => {

  const [stockData, setStockData] = useState(props.data);
  const [ticker, setTicker] = useState(default_ticker);

  return (
    <div>
      <Head>
        <title>Home</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>
      <main>
        <div>
          <Nav />
          <StockSearchBar tickers ={props.tickers} setStockData={setStockData} setTicker={setTicker} />
          <StockPlot data={stockData} ticker={ticker}/>
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps (ctx) {
  // get the current environment
  const dev = process.env.NODE_ENV !== 'production'
  const { DEV_URL, PROD_URL } = process.env

  // request tickers from api
  const responseTickers = await fetch(`${dev ? DEV_URL : PROD_URL}/api/tickers`)
  // extract the data
  const tickercurrData = await responseTickers.json()

  const responseTickerData = await fetch(
    `${dev ? DEV_URL : PROD_URL}/api/stock_data` + `?${default_ticker}`,
    {
      method: 'GET'
    }
  )

  const tickerData = await responseTickerData.json()

  const tickers = unpack(tickercurrData.message, 'Stock-ticker').sort()

  const defaultTickerData = {
    Date: unpack(tickerData.message, 'Date').reverse(),
    close: unpack(tickerData.message, 'Close/Last').reverse(),
    Volume: unpack(tickerData.message, 'Volume').reverse(),
    Open: unpack(tickerData.message, 'Open').reverse(),
    High: unpack(tickerData.message, 'High').reverse(),
    Low: unpack(tickerData.message, 'Low').reverse()
  }

  return {
    props: {
      tickers: tickers,
      data: defaultTickerData,
    }
  }
}

export default ChartPage