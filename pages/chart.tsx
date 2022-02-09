import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import styles from '../styles/Home.module.scss'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Head from 'next/head'

import { processma } from '../graph functions/movingaverage'
import {
  bollBandData,
  bollingerBands
} from '../graph functions/bollingerBands'
import { onBalanceVolume } from '../graph functions/onBalanceVolume'
import { calculateMACD } from '../graph functions/calculateMACD'
import { calculateADX } from '../graph functions/averageDirectionIndex'
import { calculateRSI } from '../graph functions/relativeStrengthIndex'
import { calculateAccDis } from '../graph functions/accumulationDistributionIdx'
import { calculateStoOsc } from '../graph functions/stochasticOscillator'

const PlotlyChart = dynamic(() => import('react-plotlyjs-ts'), { ssr: false })

export interface StockData {
  Date: string[];
  close: number[];
  Volume: number[];
  Open: number[];
  High: number[];
  Low: number[];
}

function unpack (rows, key) {
  return rows.map(function (row) {
    if (key === 'Date') {
      return row[key]
    }
    return key !== "Stock-ticker" ? Number(row[key].replace(",","")) : row[key];
  })
}

export default function OHLCChart ({ tickers, defaultData }) {
  // initialise key variables
  const [ticker, setTicker] = useState('')
  const [viewedTicker, setViewedTicker] = useState('AAPL')
  const [validTickers, setValidTickers] = useState(tickers)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [clientSide, setClientSide] = useState(false)
  const [numVisible, setNumVisible] = useState(Infinity)

  // initialize plotting variables
  const [currData, setData] = useState<StockData>({
    Date: ['01/01/2021'],
    close: [],
    Volume: [],
    Open: [],
    High: [],
    Low: []
  })
  const [ma50, setma50] = useState({
    Date: [],
    close: [],
    Volume: [],
    Open: [],
    High: [],
    Low: []
  })
  const [ma200, setma200] = useState({
    Date: [],
    close: [],
    Volume: [],
    Open: [],
    High: [],
    Low: []
  })
  const [bollBands, setBB] = useState<bollBandData>({
    Date: [],
    extremes: [],
    middle: [],
    extreme_dates: []
  })
  const [OBV, setOBV] = useState({
    date: [],
    OBV: []
  })
  const [MACD, setMACD] = useState({
    date: [],
    macd: []
  })
  const [ADX, setADX] = useState({
    Date: [],
    adx: []
  })
  const [RSI, setRSI] = useState({
    Date: [],
    rsi: [],
    ma_dates: [],
    ma: []
  })
  const [accDis, setaccDis] = useState({
    Date: [],
    accDis: []
  })
  const [stoOsc, setstoOsc] = useState({
    k_Date: [],
    k_fast: [],
    d_Date: [],
    d_slow: []
  })

  // set visiblity hooks
  const [vOHLC, setvOHLC] = useState(true)
  const [v50ma, setv50ma] = useState(false)
  const [v200ma, setv200ma] = useState(false)
  const [vBB, setvBB] = useState(false)
  const [vOBV, setvOBV] = useState(false)
  const [vMACD, setvMACD] = useState(false)
  const [vADX, setvADX] = useState(false)
  const [vRSI, setvRSI] = useState(false)
  const [vaccDis, setvaccDis] = useState(false)
  const [vstoOsc, setvstoOsc] = useState(false)

  // onLoad, set initial values in the window
  useEffect(() => {
    setClientSide(true)
    setData(defaultData)
    setma50(processma(defaultData, 50))
    setma200(processma(defaultData, 200))
    setBB(bollingerBands(defaultData))
    setOBV(onBalanceVolume(defaultData))
    setMACD(calculateMACD(defaultData))
    setADX(calculateADX(defaultData, 14, 14))
    setRSI(calculateRSI(defaultData, 14))
    setaccDis(calculateAccDis(defaultData))
    setstoOsc(calculateStoOsc(defaultData, 14, 3))
  }, [clientSide])

  // transform stock data

  /// Doesnt work - use to set ## of subplots for MACD, Vol, etc.

  // function changeNV(toggled) {
  //   console.log(numVisible)
  //   if (numVisible===Infinity) {
  //     setNumVisible(1);
  //     return;
  //   }
  //   const pos = toggled ?  1: -1;
  //   const nv = numVisible + pos;
  //   if (nv===0) {
  //     setNumVisible(Infinity);
  //     return;
  //   }
  //   else {
  //     setNumVisible(numVisible+pos);
  //     return;
  //   }
  // }
  // update tickers in dropdown list
  function filterTickers () {
    const searchTerm = ticker.toLowerCase()
    console.log(validTickers);
    setValidTickers(
      tickers.filter(function (t) {
        if (t.toLowerCase().indexOf(searchTerm) > -1) {
          return true
        } else {
          return false
        }
      })
    )
  }

  // check for enter key press
  function clickPress (e) {
    if (e.keyCode === 13) {
      handleRequest(e)
    }
  }

  // change ticker onClick of dropdown item
  function handleClick (tick) {
    return () => {
      setTicker(tick || ticker)
    }
  }

  // handle Request for information
  const handleRequest = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // reset error and message
    setError('')
    setMessage('')

    // fields check
    if (!ticker) return setError('All fields are required')

    const response = await fetch('/api/stock_data?' + ticker, {
      method: 'GET'
    })

    const trace = await response.json()

    if (trace.success) {
      setViewedTicker(ticker)
      setTicker('')
      const dataTransformed: StockData = {
        Date: unpack(trace.message, 'Date').reverse(),
        close: unpack(trace.message, 'Close/Last').reverse(),
        Volume: unpack(trace.message, 'Volume').reverse(),
        Open: unpack(trace.message, 'Open').reverse(),
        High: unpack(trace.message, 'High').reverse(),
        Low: unpack(trace.message, 'Low').reverse()
      }
      setData(dataTransformed)
      setma50(processma(dataTransformed, 50))
      setma200(processma(dataTransformed, 200))
      setBB(bollingerBands(dataTransformed))
      setOBV(onBalanceVolume(dataTransformed))
      setMACD(calculateMACD(dataTransformed))
      setADX(calculateADX(dataTransformed, 14, 14))
      setRSI(calculateRSI(dataTransformed, 14))
      setaccDis(calculateAccDis(dataTransformed))
      setstoOsc(calculateStoOsc(dataTransformed, 14, 3))
      return setMessage(ticker)
    } else {
      return setError(trace.message)
    }
  }

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
          <div className="container">
            <form
              onKeyPress={(e) => {
                clickPress(e)
              }}
              onSubmit={handleRequest}
              className={styles.form}
            >
              {error
                ? (
                <div className={styles.formItem}>
                  <h3 className={styles.error}>{error}</h3>
                </div>
                  )
                : null}
              {viewedTicker
                ? (
                <div className={styles.formItem}>
                  <h3 className={styles.message}>{viewedTicker}</h3>
                </div>
                  )
                : null}
              <div className="dropdown is-active">
                <div className="dropdown-trigger">
                  <input
                    className="input is-large"
                    type="text"
                    name="title"
                    onChange={(e) => {
                      setTicker(e.target.value)
                    }}
                    onKeyUp={() => {
                      filterTickers()
                    }}
                    value={ticker}
                    placeholder="AAPL"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu"
                  />
                  <span className="icon is-small">
                    <i className="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                  <div className="dropdown-content">
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={handleClick(validTickers[0])}
                    >
                      {validTickers[0] || ''}
                    </a>
                    <a
                      className="dropdown-item"
                      onClick={handleClick(validTickers[1])}
                    >
                      {validTickers[1] || ''}
                    </a>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={handleClick(validTickers[2])}
                    >
                      {validTickers[2] || ''}
                    </a>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={handleClick(validTickers[3])}
                    >
                      {validTickers[3] || ''}
                    </a>
                  </div>
                </div>
                <div className="container">
                  <button className="button is-large" type="submit">
                    Get Info
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div>
            <div className="container is-fluid">
              <div className="tile is-ancestor">
                <div className="tile is-vertical is-1">
                  <button
                    type="button"
                    onClick={() => {
                      setvOHLC(!vOHLC)
                    }}
                  >
                    Toggle {viewedTicker}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setv50ma(!v50ma)
                      // changeNV(v50ma);
                    }}
                  >
                    Toggle 50-day-MA
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setv200ma(!v200ma)
                      // changeNV(v200ma);
                    }}
                  >
                    Toggle 200-day-MA
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setvBB(!vBB)
                      // changeNV(vBB);
                    }}
                  >
                    Toggle Bollinger Bands
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setvOBV(!vOBV)
                      // changeNV(vOBV);
                    }}
                  >
                    Toggle On Balance Volume
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setvMACD(!vMACD)
                      // changeNV(vMACD);
                    }}
                  >
                    Toggle MACD
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setvADX(!vADX)
                      // changeNV(vMACD);
                    }}
                  >
                    Toggle ADX
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setvRSI(!vRSI)
                      // changeNV(vMACD);
                    }}
                  >
                    Toggle RSI
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setvaccDis(!vaccDis)
                      // changeNV(vMACD);
                    }}
                  >
                    Toggle AccDis
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setvstoOsc(!vstoOsc)
                      // changeNV(vMACD);
                    }}
                  >
                    Toggle Stochastic Oscillator
                  </button>
                </div>
                <div className="tile is-parent">
                  <PlotlyChart
                    data={[
                      {
                        x: currData.Date,
                        close: currData.close,
                        high: currData.High,
                        low: currData.Low,
                        open: currData.Open,

                        increasing: { line: { color: 'green' } },
                        decreasing: { line: { color: 'red' } },
                        visible: vOHLC,
                        name: 'AAPL D',

                        type: 'candlestick',
                        xaxis: 'x',
                        yaxis: 'y'
                      },
                      {
                        x: ma50.Date,
                        y: ma50.close,
                        type: 'line',
                        xaxis: 'x',
                        yaxis: 'y',
                        visible: v50ma,
                        marker: { color: 'orange' },
                        name: '50MA'
                      },
                      {
                        x: ma200.Date,
                        y: ma200.close,
                        type: 'line',
                        xaxis: 'x',
                        yaxis: 'y',
                        visible: v200ma,
                        marker: { color: 'yellow' },
                        name: '200MA'
                      },
                      {
                        x: bollBands.Date,
                        y: bollBands.middle,
                        type: 'line',
                        xaxis: 'x',
                        yaxis: 'y',
                        marker: { color: 'orange' },
                        line: { color: 'rgba(0,0,200, 0.3)' },
                        visible: vBB,
                        name: 'Bollinger Bands'
                      },
                      {
                        x: bollBands.extreme_dates,
                        y: bollBands.extremes,
                        fill: 'tozeroy',
                        xaxis: 'x',
                        yaxis: 'y',
                        fillcolor: 'rgba(0,176,246,0.2)',
                        line: { color: 'rgba(0,0,200, 0.3)' } /* 173, 216, 230 */,
                        type: 'line',
                        visible: vBB,
                        name: 'Bollinger Bands'
                      },
                      {
                        x: OBV.date,
                        y: OBV.OBV,
                        xaxis: 'x',
                        yaxis: 'y2',
                        line: { color: 'rgba(0,0,200, 1)' } /* 173, 216, 230 */,
                        type: 'line',
                        visible: vOBV,
                        name: 'On Balance Volume'
                      },
                      {
                        x: MACD.date,
                        y: MACD.macd,
                        xaxis: 'x',
                        yaxis: 'y2',
                        line: { color: 'rgba(0,200,200, 1)' } /* 173, 216, 230 */,
                        type: 'line',
                        visible: vMACD,
                        name: 'MACD'
                      },
                      {
                        x: ADX.Date,
                        y: ADX.adx,
                        xaxis: 'x',
                        yaxis: 'y2',
                        line: {
                          color: 'rgba(200,200,200, 1)'
                        } /* 173, 216, 230 */,
                        type: 'line',
                        visible: vADX,
                        name: 'ADX'
                      },
                      {
                        x: RSI.Date,
                        y: RSI.rsi,
                        xaxis: 'x',
                        yaxis: 'y2',
                        line: { color: 'rgba(200,0,100, 1)' } /* 173, 216, 230 */,
                        type: 'line',
                        visible: vRSI,
                        name: 'RSI'
                      },
                      {
                        x: RSI.ma_dates,
                        y: RSI.ma,
                        xaxis: 'x',
                        yaxis: 'y2',
                        line: {
                          color: 'rgba(100,50,150, 1)'
                        } /* 173, 216, 230 */,
                        type: 'line',
                        visible: vRSI,
                        name: 'RSI ma 14'
                      },
                      {
                        x: accDis.Date,
                        y: accDis.accDis,
                        xaxis: 'x',
                        yaxis: 'y2',
                        line: {
                          color: 'rgba(100,50,150, 1)'
                        } /* 173, 216, 230 */,
                        type: 'line',
                        visible: vaccDis,
                        name: 'Accumulation Distribution'
                      },
                      {
                        x: stoOsc.k_Date,
                        y: stoOsc.k_fast,
                        xaxis: 'x',
                        yaxis: 'y2',
                        line: {
                          color: 'rgba(20,1750,50, 1)'
                        } /* 173, 216, 230 */,
                        type: 'line',
                        visible: vstoOsc,
                        name: 'Stochastic Oscillator Fast'
                      },
                      {
                        x: stoOsc.d_Date,
                        y: stoOsc.d_slow,
                        xaxis: 'x',
                        yaxis: 'y2',
                        line: { color: 'rgba(0,0,0, 1)' } /* 173, 216, 230 */,
                        type: 'line',
                        visible: vstoOsc,
                        name: 'Stochastic Oscillator Slow'
                      }
                    ]}
                    layout={{
                      // onClick:{console.log("eee")},
                      barmode: 'stack',
                      uirevision: 'true',
                      title: viewedTicker,
                      width: clientSide ? window.screen.availWidth * 0.8 : 2000,
                      height: clientSide
                        ? window.screen.availHeight * 0.75
                        : 1300,
                      dragmode: 'zoom',
                      showlegend: true,
                      xaxis: {
                        domain: [0, 1],
                        anchor: 'y2'
                      },
                      yaxis: {
                        domain: [0.25, 1],
                        fixedrange: false,
                        anchor: 'x'
                      },
                      xaxis2: {
                        range: clientSide ? currData.Date : [],
                        domain: [0, 1],
                        rangeslider: {
                          visible: true
                        },
                        anchor: 'y'
                      },
                      yaxis2: {
                        domain: [0, 0.25],
                        fixedrange: false,
                        anchor: 'x'
                      },
                      // To be added + more for multiple subplots for MACD, Vol etc.
                      // xaxis3: {
                      //   domain: [0, 1],
                      //   rangeslider: {
                      //     visible: true,
                      //   },
                      //   anchor: "y3",
                      // },
                      // yaxis3: {
                      //   domain: [0.25*(1/numVisible),Math.min(0.25,0.25*(2/numVisible))],
                      //   fixedrange: false,
                      //   anchor: "x2",
                      // },
                      modebar: {
                        add: ['drawline', 'eraseshape']
                      },
                      shapes: [
                        // // 1st highlight during Feb 4 - Feb 6
                        // {
                        //   type: 'rect',
                        //   // x-reference is assigned to the x-values
                        //   xref: 'x',
                        //   // y-reference is assigned to the plot paper [0,1]
                        //   yref: 'y',
                        //   x0: currData.Date.at(-1), // currData.Date.at(-1), //'01/01/2021',
                        //   y0: currData.High.at(currData.Date.indexOf('01/04/2022')),
                        //   x1: currData.Date.at(0), // "01/01/2024",
                        //   y1: currData.High.at(currData.Date.indexOf('01/04/2022')) - 0.318 * (currData.High.at(currData.Date.indexOf('01/04/2022')) - currData.Low.at(currData.Date.indexOf('10/04/2021'))),
                        //   fillcolor: 'red',
                        //   opacity: 0.35,
                        //   line: {
                        //     width: 3
                        //   },
                        //   editable: true
                        // },
                        // {
                        //   type: 'rect',
                        //   // x-reference is assigned to the x-values
                        //   xref: 'x',
                        //   // y-reference is assigned to the plot paper [0,1]
                        //   yref: 'y',
                        //   x0: currData.Date.at(-1), // currData.Date.at(-1), //'01/01/2021',
                        //   y0: currData.High.at(currData.Date.indexOf('01/04/2022')) - 0.318 * (currData.High.at(currData.Date.indexOf('01/04/2022')) - currData.Low.at(currData.Date.indexOf('10/04/2021'))),
                        //   x1: currData.Date.at(0), // "01/01/2024",
                        //   y1: currData.High.at(currData.Date.indexOf('01/04/2022')) - 0.5 * (currData.High.at(currData.Date.indexOf('01/04/2022')) - currData.Low.at(currData.Date.indexOf('10/04/2021'))),
                        //   fillcolor: 'orange',
                        //   opacity: 0.35,
                        //   line: {
                        //     width: 3
                        //   },
                        //   editable: true
                        // },
                        // {
                        //   type: 'rect',
                        //   // x-reference is assigned to the x-values
                        //   xref: 'x',
                        //   // y-reference is assigned to the plot paper [0,1]
                        //   yref: 'y',
                        //   x0: currData.Date.at(-1), // currData.Date.at(-1), //'01/01/2021',
                        //   y0: currData.High.at(currData.Date.indexOf('01/04/2022')) - 0.5 * (currData.High.at(currData.Date.indexOf('01/04/2022')) - currData.Low.at(currData.Date.indexOf('10/04/2021'))),
                        //   x1: currData.Date.at(0), // "01/01/2024",
                        //   y1: currData.High.at(currData.Date.indexOf('01/04/2022')) - 0.76 * (currData.High.at(currData.Date.indexOf('01/04/2022')) - currData.Low.at(currData.Date.indexOf('10/04/2021'))),
                        //   fillcolor: 'yellow',
                        //   opacity: 0.35,
                        //   line: {
                        //     width: 3
                        //   },
                        //   editable: true
                        // },
                        // {
                        //   type: 'rect',
                        //   // x-reference is assigned to the x-values
                        //   xref: 'x',
                        //   // y-reference is assigned to the plot paper [0,1]
                        //   yref: 'y',
                        //   x0: currData.Date.at(-1), // currData.Date.at(-1), //'01/01/2021',
                        //   y0: currData.High.at(currData.Date.indexOf('01/04/2022')) - 0.76 * (currData.High.at(currData.Date.indexOf('01/04/2022')) - currData.Low.at(currData.Date.indexOf('10/04/2021'))),
                        //   x1: currData.Date.at(0), // "01/01/2024",
                        //   y1: currData.Low.at(currData.Date.indexOf('10/04/2021')),
                        //   fillcolor: 'green',
                        //   opacity: 0.35,
                        //   line: {
                        //     width: 3
                        //   },
                        //   editable: true
                        // }
                        // // {
                        // //   editable: "true",
                        // //   type: "path",
                        // //   line: { color: "yellow", width: 3 },
                        // //   fillcolor:"blue",
                        // //   path: `M ${currData.Date.at(-200)},${currData.High.at(-5)} L ${currData.Date.at(0)},${currData.High.at(-5)}`,

                        // // },
                        // // {
                        // //   editable: "true",
                        // //   type: "path",
                        // //   line: { color: "orange", width: 3 },
                        // //   fillcolor:"blue",
                        // //   path: `M ${currData.Date.at(-200)},${currData.High.at(-3)} L ${currData.Date.at(0)},${currData.High.at(-3)}`,

                        // // },
                        // // {
                        // //   editable: "true",
                        // //   type: "path",
                        // //   line: { color: "red", width: 3 },
                        // //   fillcolor:"blue",
                        // //   path: `M ${currData.Date.at(-200)},${currData.High.at(-2)} L ${currData.Date.at(0)},${currData.High.at(-2)} S red`,

                        // // },
                        // // {
                        // //   editable: "true",
                        // //   type: "path",
                        // //   line: { color: "green", width: 3 },
                        // //   fillcolor:"blue",
                        // //   path: `M ${currData.Date.at(-200)},${currData.High.at(-1)} L ${currData.Date.at(0)},${currData.High.at(-1)} `,

                        // // },
                      ]
                    }}
                  />
                </div>

                <div className="container">
                  <h1>Fake Ads here</h1>
                  <Image
                    src="https://www.designyourway.net/blog/wp-content/uploads/2010/11/Nike-Print-Ads-12.jpg"
                    width="300"
                    height="500"
                    alt="Advert #1"
                  ></Image>
                  <Image
                    src="https://landerapp.com/blog/wp-content/uploads/2018/08/barcadi.jpg"
                    width="300"
                    height="500"
                    alt="Advert #2"
                  ></Image>
                </div>
              </div>
            </div>
          </div>
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

  // fetch default ticker data == "AAPL"

  const responseTickerData = await fetch(
    `${dev ? DEV_URL : PROD_URL}/api/stock_data` + '?AAPL',
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
      defaultData: defaultTickerData,
    }
  }
}
