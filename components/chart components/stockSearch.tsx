import React, { useState } from 'react'
import styles from '../../styles/Home.module.scss'
import filterTickers from '../../helper/filterTickers'

const StockSearchBar = (props) => {
  // initialise key variables
  const [ticker, setTicker] = useState('')
  const [viewedTicker, setViewedTicker] = useState('AAPL')
  const [validTickers, setValidTickers] = useState(props.tickers)
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
      setTicker(tick || ticker)
    }
  }

  // reset ticker and valid tickers post handleRequest
  const handleResetTicker = () => {
    setTicker('')
    setValidTickers(filterTickers('', props.tickers))
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

    if (trace.success) {
      setViewedTicker(ticker)
      props.setTicker(ticker)
      props.setStockData(trace.message)
      handleResetTicker()
      return setMessage(`${ticker} now showing, for more tickers, simply submit a new request!`)
    } else {
      handleResetTicker()
      return setError(trace.message)
    }
  }

  return (
    <div className="tile">
      <div className="tile is-parent is-6">
        {/* <div className="tile is-child is-success"> */}
        <article className="panel is-child is-primary">
          <div className="panel-block">
            <p className="control has-icons-left">
              <input
                className="input is-primary"
                type="text"
                placeholder={viewedTicker}
                onKeyPress={(e) => {
                  pressEnter(e)
                }}
                onChange={(e) => {
                  setTicker(e.target.value)
                }}
                onKeyUp={() => {
                  setValidTickers(filterTickers(ticker, props.tickers))
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
        </article>
        {/* </div> */}
      </div>
      <div className="tile is-parent is-6">
        <article className="tile is-child is-primary box">
          <div className="content">
            <div className="content">
              <p>{error || message}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export default StockSearchBar
