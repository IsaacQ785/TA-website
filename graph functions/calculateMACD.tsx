import { StockData } from "../pages/chart";

export function calculateMACD(data: StockData) {
  let macd = {
    date: [],
    macd: [],
  };
  let ema12 = {};
  let ema26 = {};
  const smoothing = 2;
  let m12 = smoothing / 13,
    m26 = smoothing / 27,
    sma12 = 0,
    sma26 = 0;

  for (let i = 0; i < 12; i++) {
    sma12 += data.close.at(i) / 12;
    sma26 += data.close.at(i) / 26;
  }
  let p_date = data.Date.at(11);

  ema12[p_date] = sma12;

  for (let i = 12; i < 26; i++) {
    const c_date = data.Date.at(i);
    ema12[c_date] = data.close.at(i) * m12 + ema12[p_date] * (1 - m12);
    sma26 += data.close.at(i) / 26;
    p_date = c_date;
  }

  ema26[p_date] = sma26;

  for (let i = 26; i < data.close.length; i++) {
    const c_date = data.Date.at(i);
    ema12[c_date] = data.close.at(i) * m12 + ema12[p_date] * (1 - m12);
    ema26[c_date] = data.close.at(i) * m26 + ema26[p_date] * (1 - m26);
    macd.date.push(c_date);
    macd.macd.push(ema12[c_date] - ema26[c_date]);
    p_date = c_date;
  }
  return macd;
}
