// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Head from 'next/head'
import unpack from '../helper/unpack'
import StockSearchBar from '../components/chart components/stockSearch'
import StockPlot from '../components/chart components/stockHighChart'
import Adverts from '../components/Adverts'
import PropTypes from 'prop-types'

export interface StockData {
  Date: string[];
  close: number[];
  Volume: number[];
  Open: number[];
  High: number[];
  Low: number[];
}
const defaultTicker = 'AAPL'

const ChartPage = (props) => {
  const [stockData, setStockData] = useState([]) // props.data)
  const [ticker, setTicker] = useState(defaultTicker)
  const [responseTickerData, setResponseTickerData] = useState(props.data)
  // useEffect(() => {
  //   const dev = process.env.NODE_ENV !== 'production'
  //   const { DEV_URL, PROD_URL } = process.env
  //   setResponseTickerData(
  //     fetch(
  //       `${dev ? DEV_URL : PROD_URL}/api/stock_data` + `?${defaultTicker}`,
  //       {
  //         method: 'GET'
  //         // body: JSON.stringify({ ticker: defaultTicker })
  //       }
  //     )
  //   )
  // }, [])

  useEffect(() => {
    setStockData(responseTickerData)
    console.log(responseTickerData)
  }, [responseTickerData])
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
        <Nav />
        <div className="container is-max-desktop">
          <StockSearchBar
            tickers={props.tickers}
            setStockData={setStockData}
            setTicker={setTicker}
          />
        </div>
        <div className="container is-fluid">
          <div className="tile is-ancestor">
            <div className="tile is-parent is-2"></div>
          </div>
          <div className="tile is-ancestor ">
            <div className="tile is-11">
              <StockPlot data={stockData} ticker={ticker} />
            </div>

            <div id="adverts" className="tile ">
              <Adverts />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

ChartPage.propTypes = {
  tickers: PropTypes.array,
  data: PropTypes.array
}

export async function getServerSideProps (ctx) {
  // get the current environment
  const dev = process.env.NODE_ENV !== 'production'
  const { DEV_URL, PROD_URL } = process.env

  // request tickers from api
  const responseTickers = await fetch(
    `${dev ? DEV_URL : PROD_URL}/api/tickers`
  )
  // extract the data
  const tickercurrData = await responseTickers.json()

  const responseTickerData = await fetch(
    `${dev ? DEV_URL : PROD_URL}/api/stock_data` + `?${defaultTicker}`,
    {
      method: 'GET'
      // body: JSON.stringify({ ticker: defaultTicker })
    }
  )
  let tickers = [{ ticker: 'AAPL' }]
  const tickerData = await responseTickerData.json()
  if (tickercurrData.success) {
    tickers = unpack(tickercurrData.message, 'Stock-ticker').sort()
  }

  return {
    props: {
      tickers: tickers,
      data: tickerData.message
    }
  }
}

export default ChartPage
