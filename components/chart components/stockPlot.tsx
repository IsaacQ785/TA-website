// eslint-disable-next-line no-use-before-define
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
import { StockData } from '../../pages/chart'
import unpack from '../../helper/unpack'
import PropTypes from 'prop-types'
const PlotlyChart = dynamic(() => import('react-plotlyjs-ts'), { ssr: false })
let HighCharts = require('highcharts')

const StockPlot = (props) => {
  const [viewedTicker, setViewedTicker] = useState(props.ticker)
  const [clientSide, setClientSide] = useState(false)
  // const [numVisible, setNumVisible] = useState(Infinity)
  const [dataWidth, setDataWidth] = useState(0.01)
  const [plotWidth, setPlotWidth] = useState(1000)
  const [plotHeight] = useState(1000)
  // const observer = window.ResizeObserver
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
  let resizeCount = 0
  function onResize (resizeProps) {
    resizeProps.forEach((resize) => {
      console.log(resizeCount++)
      console.log(resize)
      // setPlotHeight(resize.target.clientHeight)
      setPlotWidth(resize.target.clientWidth)
    })
  }
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
  const [vRawData, setvRawData] = useState(false)

  // onLoad, set initial values in the window
  useEffect(() => {
    const myObserver = new ResizeObserver(onResize)
    console.log('here')
    setClientSide(true)
    myObserver.observe(document.getElementById('plotlychart'))
    const dataTransformed: StockData = {
      Date: unpack(props.data, 'Date').reverse(),
      close: unpack(props.data, 'Close/Last').reverse(),
      Volume: unpack(props.data, 'Volume').reverse(),
      Open: unpack(props.data, 'Open').reverse(),
      High: unpack(props.data, 'High').reverse(),
      Low: unpack(props.data, 'Low').reverse()
    }
    setViewedTicker(props.ticker)
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
  }, [])

  useEffect(() => {
    const dataTransformed: StockData = {
      Date: unpack(props.data, 'Date').reverse(),
      close: unpack(props.data, 'Close/Last').reverse(),
      Volume: unpack(props.data, 'Volume').reverse(),
      Open: unpack(props.data, 'Open').reverse(),
      High: unpack(props.data, 'High').reverse(),
      Low: unpack(props.data, 'Low').reverse()
    }
    setViewedTicker(props.ticker)
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
    console.log("Stock Plot Data Updated")
    console.log(props.data)
  }, [props.data])

  const setRawDataScale = (val) => {
    setDataWidth(val / 100)
  }

  const resetPlot = () => {
    setv50ma(false)
    setv200ma(false)
    setvBB(false)
    setvOBV(false)
    setvMACD(false)
    setvADX(false)
    setvRSI(false)
    setvaccDis(false)
    setvstoOsc(false)
    setvRawData(false)
  }

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

  return (
    <>
      <div className="tile is-2" >
        <div className="tile is-parent is-vertical box">
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
          <button
            type="button"
            onClick={() => {
              !vRawData ? setRawDataScale(25) : setRawDataScale(1)
              setvRawData(!vRawData)
            }}
          >
            Toggle Raw Data
          </button>
          <button type="button" onClick={resetPlot}>
            Reset Plot
          </button>
          <div className="slidecontainer">
            {vRawData
              ? (
              <input
                type="range"
                min="1"
                max="50"
                defaultValue="25"
                className="slider"
                id="myRange"
                onChange={(e) => {
                  setRawDataScale(e.target.value)
                }}
              />
                )
              : null}
          </div>
        </div>
      </div>
      <div className="tile is-10" id="plotlychart">
        <div className="tile is-parent" >
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
              },
              {
                type: 'table',
                name: 'Stock Data',
                visible: vRawData,
                header: {
                  values: Object.keys(currData),
                  align: 'center',
                  line: { width: 1, color: 'rgb(50, 50, 50)' },
                  fill: { color: ['rgb(235, 100, 230)'] },
                  font: { family: 'Arial', size: 11, color: 'white' }
                },
                cells: {
                  values: Object.values(currData),
                  align: ['center', 'center'],
                  line: { color: 'black', width: 1 },
                  fill: {
                    color: ['rgb(235, 193, 238)', 'rgba(228, 222, 249, 0.65)']
                  },
                  font: { family: 'Arial', size: 10, color: ['black'] }
                },
                xaxis: 'x',
                yaxis: 'y',
                domain: { x: [0, (99 / 100) * dataWidth], y: [0, 1] }
              }
            ]}
            layout={{
              barmode: 'stack',
              uirevision: 'true',
              title: viewedTicker,
              autosize: true,
              width: plotWidth,
              height: plotHeight,
              dragmode: 'zoom',
              showlegend: true,
              xaxis: {
                domain: [0.01 + (101 / 100) * dataWidth, 1],
                anchor: 'y2'
              },
              yaxis: {
                domain: [0.26, 1],
                fixedrange: false,
                anchor: 'x'
              },
              xaxis2: {
                range: clientSide ? currData.Date : [],
                domain: [0.01 + (101 / 100) * dataWidth, 1],
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
              modebar: {
                add: ['drawline', 'eraseshape', 'drawcircle']
              }
            }}
          />
        </div>
      </div>
    </>
  )
}

StockPlot.propTypes = {
  stockData: PropTypes.object,
  ticker: PropTypes.string,
  windowSize: PropTypes.array,
  data: PropTypes.array
}

export default StockPlot
