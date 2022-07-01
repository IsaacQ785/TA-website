// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect } from 'react'
import filterTickers from '../../helper/filterTickers'
import PropTypes from 'prop-types'

const StockSearchBar = ({ setTicker, tickers, setStockData }) => {
  // initialise key variables
  const [ticker, setCurrentSearchTicker] = useState('')
  const [viewedTicker, setViewedTicker] = useState('AAPL')
  const [validTickers, setValidTickers] = useState(tickers)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // check for enter key press
  function pressEnter (e) {
    if (e.charCode === 13) {
      handleRequest(e)
    }
  }

  // handle pressing of dropdown element
  const handleClick = (tick) => {
    return () => {
      setCurrentSearchTicker(tick || ticker)
    }
  }

  // reset ticker and valid tickers post handleRequest
  const handleResetTicker = () => {
    setCurrentSearchTicker('')
    setValidTickers(filterTickers('', tickers))
  }

  // handle onSubmit of request for ticker info
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
    console.log('Contacted database')
    if (trace.success) {
      setViewedTicker(ticker)
      setTicker(ticker)
      setStockData(trace.message)
      handleResetTicker()
      setMessage(
        `${ticker} now showing, for more tickers, simply submit a new request!`
      )
    } else {
      handleResetTicker()
      setError(trace.message)
    }
  }

  // Log fetching message onChange
  useEffect(() => {
    console.log(message, error)
  }, [message, error])

  return (
    <div id="Stock Search Bar">
        <nav className="panel">
          <div className="panel-block">
            <p className="control has-icons-left">
              <input
                className="input is-primary"
                type="text"
                placeholder={'Search by Ticker here. E.g. The current viewedTicker is ' + viewedTicker + ') '}
                onKeyPress={(e) => {
                  pressEnter(e)
                }}
                onChange={(e) => {
                  setCurrentSearchTicker(e.target.value)
                }}
                onKeyUp={() => {
                  setValidTickers(filterTickers(ticker, tickers))
                }}
                value={ticker}
              />
              <span className="icon is-left">
                <i className="fas fa-search" aria-hidden="true"></i>
              </span>
            </p>
          </div>
          {validTickers[0]
            ? (
            <a
              className="panel-block is-active"
              onClick={handleClick(validTickers[0])}
            >
              <span className="panel-icon">
                <i className="fas fa-book" aria-hidden="true"></i>
              </span>
              {validTickers[0] || ''}
            </a>
              )
            : null}
          {validTickers[1]
            ? (
            <a className="panel-block" onClick={handleClick(validTickers[1])}>
              <span className="panel-icon">
                <i className="fas fa-book" aria-hidden="true"></i>
              </span>
              {validTickers[1] || ''}
            </a>
              )
            : null}
          {validTickers[2]
            ? (
            <a className="panel-block" onClick={handleClick(validTickers[2])}>
              <span className="panel-icon">
                <i className="fas fa-book" aria-hidden="true"></i>
              </span>
              {validTickers[2] || ''}
            </a>
              )
            : null}
          {validTickers[3]
            ? (
            <a className="panel-block" onClick={handleClick(validTickers[3])}>
              <span className="panel-icon">
                <i className="fas fa-book" aria-hidden="true"></i>
              </span>
              {validTickers[3] || ''}
            </a>
              )
            : null}
        </nav>
      </div>
  )
}

StockSearchBar.propTypes = {
  setTicker: PropTypes.func,
  setStockData: PropTypes.func,
  tickers: PropTypes.array
}

export default StockSearchBar
