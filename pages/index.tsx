// eslint-disable-next-line no-use-before-define
import React from 'react'
import Head from 'next/head'
import Nav from '../components/Nav'
import StockPlot from '../components/chart components/stockHighChart'

const Home = (props) => {
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>

      <Nav />

      <main>
        <StockPlot stockdata={props.data}/>
      </main>
    </div>
  )
}

export async function getServerSideProps (ctx) {
  const stockdata = await fetch('https://demo-live-data.highcharts.com/aapl-ohlc.json').then(response => response.json())
  return {
    props: {
      data: stockdata
    }
  }
}

export default Home
