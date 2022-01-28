import { StockData } from "../pages/chart";

export function calculateStoOsc(
  data: StockData,
  k_period: number,
  slow_period: number
) {
  let stoOsc = {
    k_Date: [],
    k_fast: [],
    d_Date: [],
    d_slow: [],
  };

  let lows: number[] = [],
    highs = [],
    c_k = 0,
    min = 0,
    max = 0;

  for (let i = 0; i < k_period - 1; i++) {
    lows.push(Number(data.Low.at(i)));
    highs.push(Number(data.High.at(i)));
  }

  for (let i = k_period - 1; i < data.close.length; i++) {
    lows.push(Number(data.Low.at(i)));
    highs.push(Number(data.High.at(i)));
    min = lows.reduce(function (a, b) {
      return Math.min(a, b);
    });
    max = highs.reduce(function (a, b) {
      return Math.max(a, b);
    });

    c_k = ((Number(data.close.at(i)) - min) / (max - min)) * 100;

    stoOsc.k_Date.push(data.Date.at(i));
    stoOsc.k_fast.push(c_k);

    if (i >= slow_period + k_period - 2) {
      stoOsc.d_Date.push(data.Date.at(i));
      stoOsc.d_slow.push(
        stoOsc.k_fast.slice(-slow_period).reduce(function (a, b) {
          return a + b;
        })/slow_period
      );
    }
    lows.shift();
    highs.shift();
  }
  return stoOsc;
}
