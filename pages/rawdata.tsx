// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react'
import Nav from '../components/Nav'
import Head from 'next/head'
import unpack from '../helper/unpack'
import StockSearchBar from '../components/chart components/stockSearch'
import RawDataTable from '../components/rawDataTable'
import PropTypes from 'prop-types'
import DownLoadData from '../components/downloadData'

export interface StockData {
  Date: string[];
  close: number[];
  Volume: number[];
  Open: number[];
  High: number[];
  Low: number[];
}
const defaultTicker = 'AAPL'

const DataPage = (props) => {
  const [stockData, setStockData] = useState(props.data)
  const [ticker, setTicker] = useState(defaultTicker)

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

        <div className="container">
          <div className="tile is-ancestor">
            <div className="tile is-vertical">
              <div className="tile is-parent is-2"></div>
              <StockSearchBar
                tickers={props.tickers}
                setStockData={setStockData}
                setTicker={setTicker}
              />
              <div className="tile is-parent">
                <div className="tile is-child is-6">
                  <RawDataTable data={stockData} />
                </div>
                <div className="tile is-child is-1"></div>
                <div className="tile is-child">
                  <DownLoadData data={stockData} ticker={ticker} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

DataPage.propTypes = {
  data: PropTypes.array,
  tickers: PropTypes.array
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
    }
  )

  const tickerData = await responseTickerData.json()

  const tickers = unpack(tickercurrData.message, 'Stock-ticker').sort()

  return {
    props: {
      tickers: tickers,
      data: tickerData.message
    }
  }
}

export default DataPage
