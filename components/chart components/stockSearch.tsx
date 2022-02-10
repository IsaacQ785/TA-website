import React, { useEffect, useState } from 'react'
import styles from '../../styles/Home.module.scss'
import unpack from "../../helper/unpack"
import { StockData } from '../../pages/chart';

const StockSearchBar = (props) => {
  // initialise key variables
  const [ticker, setTicker] = useState('')
  const [viewedTicker, setViewedTicker] = useState('AAPL')
  const [validTickers, setValidTickers] = useState(props.tickers)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  
  // check for enter key press
  function clickPress(e) {
    if (e.keyCode === 13) {
      handleRequest(e);
    }
  }

  const filterTickers = (ticker, tickers) => {
    const searchTerm = ticker.toLowerCase();
    return tickers.filter(function (t) {
      if (t.toLowerCase().indexOf(searchTerm) > -1) {
        return true;
      } else {
        return false;
      }
    });
  }

  const handleClick = (tick) => {
    return () => {
      setTicker(tick || ticker)
    }
  }

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
      console.log(trace.message)
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
      props.setStockData(dataTransformed)
      return setMessage(ticker)
    } else {
      return setError(trace.message)
    }
  }

  return (
    <div className="container">
      <form
        onKeyPress={(e) => {
          clickPress(e);
        }}
        onSubmit={handleRequest}
        className={styles.form}
      >
        {error ? (
          <div className={styles.formItem}>
            <h3 className={styles.error}>{error}</h3>
          </div>
        ) : null}
        {viewedTicker ? (
          <div className={styles.formItem}>
            <h3 className={styles.message}>{viewedTicker}</h3>
          </div>
        ) : null}
        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              className="input is-large"
              type="text"
              name="title"
              onChange={(e) => {
                setTicker(e.target.value);
              }}
              onKeyUp={() => {
                setValidTickers(filterTickers(ticker, props.tickers));
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
                {validTickers[0] || ""}
              </a>
              <a
                className="dropdown-item"
                onClick={handleClick(validTickers[1])}
              >
                {validTickers[1] || ""}
              </a>
              <a
                href="#"
                className="dropdown-item"
                onClick={handleClick(validTickers[2])}
              >
                {validTickers[2] || ""}
              </a>
              <a
                href="#"
                className="dropdown-item"
                onClick={handleClick(validTickers[3])}
              >
                {validTickers[3] || ""}
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
  );
};

export default StockSearchBar