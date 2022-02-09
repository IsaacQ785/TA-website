import Head from 'next/head'
import React from 'react'
import Nav from '../components/Nav'

export default function Home ({ tickers }) {
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>

      <Nav />

      <main>
      </main>
    </div>
  )
}

export async function getServerSideProps (ctx) {
  // get the current environment
  const dev = process.env.NODE_ENV !== 'production'
  const { DEV_URL, PROD_URL } = process.env

  // request posts from api
  const response = await fetch(`${dev ? DEV_URL : PROD_URL}/api/tickers`)
  // extract the data
  const data = await response.json()

  function unpack (rows, key) {
    return rows.map(function (row) {
      return row[key]
    })
  }

  const tickers = unpack(data.message, 'Stock-ticker').sort()

  return {
    props: {
      tickers: tickers
    }
  }
}
