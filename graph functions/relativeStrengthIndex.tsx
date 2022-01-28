import { isReturnStatement } from "typescript";
import { StockData } from "../pages/chart";
import { processma } from "./movingaverage";

export function calculateRSI(data: StockData, rsi_period: number) {
  let rsi = {
    Date: [],
    rsi: [],
    ma_dates: [],
    ma: [],
  };

  let num_higher = rsi_period,
    num_lower = rsi_period,
    total_perc_higher = 0,
    total_perc_lower = 0,
    p_change = 0,
    old_p_change = 0,
    c_higher = 0,
    c_lower = 0,
    old_c_higher = 0,
    old_c_lower = 0;

  // sum to initial RSI
  for (let i = 1; i <= rsi_period; i++) {
    p_change =
      (Number(data.close.at(i)) - Number(data.close.at(i - 1))) /
      Number(data.close.at(i - 1));
    // num_higher += p_change >= 0 ? 1 : 0;
    // num_lower += p_change < 0 ? 1 : 0;
    total_perc_higher += Math.max(0, p_change);
    total_perc_lower += Math.min(0, p_change);
  }

  // add initial rsi
  rsi.Date.push(data.Date.at(rsi_period));
  if (num_higher === 0) {
    rsi.rsi.push(0);
  } else if (num_lower === 0) {
    rsi.rsi.push(100);
  } else {
    rsi.rsi.push(
      100 -
        100 /
          (1 + total_perc_higher / num_higher / (-total_perc_lower / num_lower))
    );
  }

  // now iterate through rest of data for rsi
  for (let i = rsi_period + 1; i < data.close.length; i++) {
    p_change =
      (Number(data.close.at(i)) - Number(data.close.at(i - 1))) /
      Number(data.close.at(i - 1));
    old_p_change =
      (Number(data.close.at(i - rsi_period)) -
        Number(data.close.at(i - 1 - rsi_period))) /
      Number(data.close.at(i - 1 - rsi_period));
    c_higher = Math.max(0, p_change);
    c_lower = Math.min(0, p_change);
    old_c_higher = Math.max(0, old_p_change);
    old_c_lower = Math.min(0, old_p_change);

    rsi.Date.push(data.Date.at(i));

    if (num_higher === 0) {
      if (c_higher === 0) {
        rsi.rsi.push(0);
      } else {
        rsi.rsi.push(
          100 -
            100 /
              (1 +
                c_higher /
                  ((-total_perc_lower * (rsi_period - 1)) / num_lower -
                    c_lower))
        );
      }
    } else if (num_lower === 0) {
      if (c_lower === 0) {
        rsi.rsi.push(100);
      } else {
        rsi.rsi.push(
          100 -
            100 /
              (1 +
                ((total_perc_higher * (rsi_period - 1)) / num_higher +
                  c_higher) /
                  -c_lower)
        );
      }
    } else {
      rsi.rsi.push(
        100 -
          100 /
            (1 +
              ((total_perc_higher * (rsi_period - 1)) / num_higher + c_higher) /
                ((-total_perc_lower * (rsi_period - 1)) / num_lower - c_lower))
      );
    }

    // num_higher += p_change >= 0 ? 1 : 0;
    // num_lower += p_change < 0 ? 1 : 0;
    // num_higher -= old_p_change >= 0 ? 1 : 0;
    // num_lower -= old_p_change < 0 ? 1 : 0;
    total_perc_higher += Math.max(0, p_change);
    total_perc_lower += Math.min(0, p_change);
    total_perc_higher -= Math.max(0, old_p_change);
    total_perc_lower -= Math.min(0, old_p_change);
  }
  let unwrap = ({ Date, rsi }) => ({ Date, rsi });
  const ma = processma(unwrap(rsi), rsi_period);
  rsi.ma = ma.rsi;
  rsi.ma_dates = ma["Date"];
  console.log(rsi);
  return rsi;
}
