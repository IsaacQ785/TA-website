import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import styles from "../styles/Home.module.scss";
import dynamic from "next/dynamic";
import Image from "next/image";
import Head from "next/head";

import { processma } from "../graph functions/movingaverage";
import {
  bollBandData,
  bollingerBands,
} from "../graph functions/bollingerBands";
import { onBalanceVolume } from "../graph functions/onBalanceVolume";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
const PlotlyChart = dynamic(() => import("react-plotlyjs-ts"), { ssr: false });

export interface StockData {
  Date: string[];
  close: string[];
  Volume: string[];
  Open: string[];
  High: string[];
  Low: string[];
}

export default function OHLCChart({ tickers, default_data }) {
  // initialise key variables
  const [ticker, setTicker] = useState("");
  const [viewed_ticker, set_viewed_ticker] = useState("AAPL");
  const [t1, sett1] = useState("");
  const [valid_tickers, set_valid_tickers] = useState(tickers);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [clientSide, setClientSide] = useState(false);

  // initialize plotting variables
  const [s_data, setData] = useState<StockData>({
    Date: ["01/01/2021"],
    close: [],
    Volume: [],
    Open: [],
    High: [],
    Low: [],
  });
  const [ma50, setma50] = useState<StockData>({
    Date: [],
    close: [],
    Volume: [],
    Open: [],
    High: [],
    Low: [],
  });
  const [ma200, setma200] = useState<StockData>({
    Date: [],
    close: [],
    Volume: [],
    Open: [],
    High: [],
    Low: [],
  });
  const [bollBands, setBB] = useState<bollBandData>({
    Date: [],
    extremes: [],
    middle: [],
    extreme_dates: [],
  });
  const [OBV, setOBV] = useState({
    date: [],
    OBV: [],
  });

  // set visiblity hooks
  const [v_ohlc, setv_ohlc] = useState(true);
  const [v_50ma, setv_ma50] = useState(false);
  const [v_200ma, setv_ma200] = useState(false);
  const [v_BB, setv_BB] = useState(false);
  const [v_OBV, setv_OBV] = useState(false);
  // onLoad, set initial values in the window
  useEffect(() => {
    setClientSide(true);
    setData(default_data);
    setma50(processma(default_data, 50));
    setma200(processma(default_data, 200));
    setBB(bollingerBands(default_data));
    setOBV(onBalanceVolume(default_data));
    console.log(OBV);
  }, [clientSide]);

  // transform stock data
  function unpack(rows, key) {
    return rows.map(function (row) {
      return row[key];
    });
  }

  // update tickers in dropdown list
  function filterTickers() {
    const search_term = ticker.toLowerCase();
    set_valid_tickers(
      tickers.filter(function (t) {
        if (t.toLowerCase().indexOf(search_term) > -1) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  // check for enter key press
  function clickPress(e) {
    if (e.keyCode === 13) {
      handleRequest(e);
    }
  }

  // change ticker onClick of dropdown item
  function handleClick(tick) {
    return () => {
      setTicker(tick || ticker);
    };
  }

  // handle Request for information
  const handleRequest = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // reset error and message
    setError("");
    setMessage("");

    // fields check
    if (!ticker) return setError("All fields are required");

    let response = await fetch("/api/stock_data?" + ticker, {
      method: "GET",
    });

    let trace = await response.json();

    if (trace.success) {
      set_viewed_ticker(ticker);
      setTicker("");
      const data_transformed: StockData = {
        Date: unpack(trace.message, "Date").reverse(),
        close: unpack(trace.message, "Close/Last").reverse(),
        Volume: unpack(trace.message, "Volume").reverse(),
        Open: unpack(trace.message, "Open").reverse(),
        High: unpack(trace.message, "High").reverse(),
        Low: unpack(trace.message, "Low").reverse(),
      };
      setData(data_transformed);
      setma50(processma(data_transformed, 50));
      setma200(processma(data_transformed, 200));
      setBB(bollingerBands(data_transformed));
      setOBV(onBalanceVolume(data_transformed));
      return setMessage(ticker);
    } else {
      return setError(trace.message);
    }
  };

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
              {viewed_ticker ? (
                <div className={styles.formItem}>
                  <h3 className={styles.message}>{viewed_ticker}</h3>
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
                      filterTickers();
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
                      onClick={handleClick(valid_tickers[0])}
                    >
                      {valid_tickers[0] || ""}
                    </a>
                    <a
                      className="dropdown-item"
                      onClick={handleClick(valid_tickers[1])}
                    >
                      {valid_tickers[1] || ""}
                    </a>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={handleClick(valid_tickers[2])}
                    >
                      {valid_tickers[2] || ""}
                    </a>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={handleClick(valid_tickers[3])}
                    >
                      {valid_tickers[3] || ""}
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
                      setv_ohlc(!v_ohlc);
                    }}
                  >
                    Toggle {viewed_ticker}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setv_ma50(!v_50ma);
                    }}
                  >
                    Toggle 50-day-MA
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setv_ma200(!v_200ma);
                    }}
                  >
                    Toggle 200-day-MA
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setv_BB(!v_BB);
                    }}
                  >
                    Toggle Bollinger Bands
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setv_OBV(!v_OBV);
                    }}
                  >
                    Toggle On Balance Volume
                  </button>
                </div>
                <div className="tile is-parent">
                  <PlotlyChart
                    data={[
                      {
                        x: s_data.Date,
                        close: s_data.close,
                        high: s_data.High,
                        low: s_data.Low,
                        open: s_data.Open,

                        increasing: { line: { color: "green" } },
                        decreasing: { line: { color: "red" } },
                        visible: v_ohlc,
                        name: "AAPL D",

                        type: "candlestick",
                        xaxis: "x",
                        yaxis: "y",
                      },
                      {
                        x: ma50.Date,
                        y: ma50.close,
                        type: "line",
                        xaxis: "x",
                        yaxis: "y",
                        visible: v_50ma,
                        marker: { color: "orange" },
                        name: "50MA",
                      },
                      {
                        x: ma200.Date,
                        y: ma200.close,
                        type: "line",
                        xaxis: "x",
                        yaxis: "y",
                        visible: v_200ma,
                        marker: { color: "yellow" },
                        name: "200MA",
                      },
                      {
                        x: bollBands.Date,
                        y: bollBands.middle,
                        type: "line",
                        xaxis: "x",
                        yaxis: "y",
                        marker: { color: "orange" },
                        line: { color: "rgba(0,0,200, 0.3)" },
                        visible: v_BB,
                        name: "Bollinger Bands",
                      },
                      {
                        x: bollBands.extreme_dates,
                        y: bollBands.extremes,
                        fill: "tozeroy",
                        xaxis: "x",
                        yaxis: "y",
                        fillcolor: "rgba(0,176,246,0.2)",
                        line: { color: "rgba(0,0,200, 0.3)" } /*173, 216, 230*/,
                        type: "line",
                        visible: v_BB,
                        name: "Bollinger Bands",
                      },
                      {
                        x: OBV.date,
                        y: OBV.OBV,
                        xaxis: "x",
                        yaxis: "y2",
                        line: { color: "rgba(0,0,200, 1)" } /*173, 216, 230*/,
                        type: "line",
                        visible: v_OBV,
                        name: "On Balance Volume",
                      },
                    ]}
                    layout={{
                      title: viewed_ticker,
                      width: clientSide ? window.screen.availWidth * 0.8 : 2000,
                      height: clientSide
                        ? window.screen.availHeight * 0.75
                        : 1300,
                      dragmode: "zoom",
                      showlegend: true,
                      xaxis: {
                        domain: [0, 1],
                        anchor: "y2",
                      },
                      yaxis: {
                        domain: [0.25, 1],
                        fixedrange: false,
                        anchor: "x",
                      },
                      xaxis2: {
                        domain: [0, 1],
                        rangeslider: {
                          visible: true,
                        },
                        anchor: "y2",
                      },
                      yaxis2: {
                        domain: [0, 0.25],
                        fixedrange: false,
                        anchor: "x2",
                      },
                      modebar: {
                        add: ["drawline", "eraseshape"],
                      },
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
  );
}

export async function getServerSideProps(ctx) {
  // get the current environment
  let dev = process.env.NODE_ENV !== "production";
  let { DEV_URL, PROD_URL } = process.env;

  // request tickers from api
  let response_tickers = await fetch(`${dev ? DEV_URL : PROD_URL}/api/tickers`);
  // extract the data
  let tickers_data = await response_tickers.json();

  //fetch default ticker data == "AAPL"

  let response_ticker_data = await fetch(
    `${dev ? DEV_URL : PROD_URL}/api/stock_data` + "?AAPL",
    {
      method: "GET",
    }
  );

  let ticker_data = await response_ticker_data.json();

  function unpack(rows, key) {
    return rows.map(function (row) {
      return row[key];
    });
  }

  const tickers = unpack(tickers_data.message, "Stock-ticker").sort();

  const default_ticker_data = {
    Date: unpack(ticker_data.message, "Date").reverse(),
    close: unpack(ticker_data.message, "Close/Last").reverse(),
    Volume: unpack(ticker_data.message, "Volume").reverse(),
    Open: unpack(ticker_data.message, "Open").reverse(),
    High: unpack(ticker_data.message, "High").reverse(),
    Low: unpack(ticker_data.message, "Low").reverse(),
  };

  return {
    props: {
      tickers: tickers,
      default_data: default_ticker_data,
    },
  };
}
