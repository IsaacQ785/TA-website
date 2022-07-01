// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
// Load Highcharts modules
// require('highcharts/indicators/indicators-all')(HighchartsReact)
import * as ind from 'highcharts/indicators/indicators-all'
// require('highcharts/indicators/indicators-all')(Highcharts)
// require('highcharts/indicators/pivot-points')(HighchartsReact)
// require('highcharts/indicators/macd')(HighchartsReact)
// require('highcharts/modules/exporting')(HighchartsReact)
// require('highcharts/modules/map')(HighchartsReact)

const StockPlot = (props) => {
  const [testData, setTestData] = useState(props.stockdata)
  useEffect(() => {
    console.log(props.stockdata)
  }, [testData])

  useEffect(() => {
    console.log('here')
    setTestData(props.stockdata)
  }, [])

  return (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        options={{

          rangeSelector: {
            selected: 2
          },

          title: {
            text: 'AAPL Stock Price'
          },

          legend: {
            enabled: true
          },

          plotOptions: {
            series: {
              showInLegend: true
            }
          },

          yAxis: [{
            height: '48%'
          }, {
            height: '40%',
            top: '60%'
          }],

          series: [{
            type: 'candlestick',
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: testData
          },
          {
            yAxis: 1,
            type: 'macd',
            linkedTo: 'aapl'
          }
          // ,
          // {
          //   yAxis: 1,
          //   type: 'aroon',
          //   linkedTo: 'aapl',
          //   color: 'green',
          //   lineWidth: 1,
          //   aroonDown: {
          //     styles: {
          //       lineColor: 'red'
          //     }
          //   },
          //   params: {
          //     period: 25
          //   }
          // }
          ]
        }}
      />
    </>
  )
}

export default StockPlot
