import Adverts from "../Adverts"
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { processma } from '../../graph functions/movingaverage'
import {
  bollBandData,
  bollingerBands
} from '../../graph functions/bollingerBands'
import { onBalanceVolume } from '../../graph functions/onBalanceVolume'
import { calculateMACD } from '../../graph functions/calculateMACD'
import { calculateADX } from '../../graph functions/averageDirectionIndex'
import { calculateRSI } from '../../graph functions/relativeStrengthIndex'
import { calculateAccDis } from '../../graph functions/accumulationDistributionIdx'
import { calculateStoOsc } from '../../graph functions/stochasticOscillator'
import { StockData } from "../../pages/chart"

const PlotlyChart = dynamic(() => import('react-plotlyjs-ts'), { ssr: false })


const StockPlot = (props) => {
  
  const [viewedTicker, setViewedTicker] = useState(props.ticker)
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
    setData(props.data)
    setma50(processma(props.data, 50))
    setma200(processma(props.data, 200))
    setBB(bollingerBands(props.data))
    setOBV(onBalanceVolume(props.data))
    setMACD(calculateMACD(props.data))
    setADX(calculateADX(props.data, 14, 14))
    setRSI(calculateRSI(props.data, 14))
    setaccDis(calculateAccDis(props.data))
    setstoOsc(calculateStoOsc(props.data, 14, 3))
  }, [props.data])

  
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
  
  // handle Request for information

    return (
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
                        domain: [0.26, 1],
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
                        domain: [0, 0.24],
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
                <Adverts/>
              </div>
            </div>
          </div>
    )
}

export default StockPlot