import { StockData } from "../pages/chart";

export function calculateADX(data: StockData, dm_period, adx_period) {
  let adx = {
    Date: [],
    adx: [],
  };
  let di_pos = 0,
    di_neg = 0,
    dx_sum = 0,
    dm_pos = 0,
    dm_neg = 0,
    s_dm_pos = 0,
    s_dm_neg = 0,
    curr_dm_pos = 0,
    curr_dm_neg = 0,
    dx_curr = 0,
    curr_tm = 0,
    atr = 0;

  if (data.close.length < dm_period + adx_period) {
    return adx;
  }

  for (let i = 1; i <= dm_period; i++) {
    curr_dm_pos = data.High.at(i) - data.High.at(i - 1);
    curr_dm_neg = data.Low.at(i - 1) - data.Low.at(i);
    if (curr_dm_pos > curr_dm_neg) {
      s_dm_pos += curr_dm_pos;
    } else {
      s_dm_neg += curr_dm_neg;
    }
    atr += Math.max(
      data.High.at(i) - data.Low.at(i),
      Math.abs(data.High.at(i) - data.close.at(i - 1)),
      Math.abs(data.Low.at(i) - data.close.at(i - 1))
    );
  }

  di_pos = (100 * s_dm_pos) / atr;
  di_neg = (100 * s_dm_neg) / atr;
  dx_curr = (Math.abs(di_pos - di_neg) / Math.abs(di_pos + di_neg)) * 100;
  dx_sum += dx_curr;

  for (let i = dm_period + 1; i < data.close.length; i++) {
    // Calculate current DM+, DM- and aTR for this period
    curr_dm_pos = data.High.at(i) - data.High.at(i - 1);
    curr_dm_neg = data.Low.at(i - 1) - data.Low.at(i);
    if (curr_dm_pos > curr_dm_neg) {
      curr_dm_neg = 0;
    } else {
      curr_dm_pos = 0;
    }
    curr_tm = Math.max(
      data.High.at(i) - data.Low.at(i),
      Math.abs(data.High.at(i) - data.close.at(i - 1)),
      Math.abs(data.Low.at(i) - data.close.at(i - 1))
    );

    // calculate current smoothed DM+- and aTR.
    atr = atr - atr / 14 + curr_tm;
    s_dm_pos = s_dm_pos * (13 / 14) + curr_dm_pos;
    s_dm_neg = s_dm_neg * (13 / 14) + curr_dm_neg;

    // Update DI+-
    di_pos = (100 * s_dm_pos) / atr;
    di_neg = (100 * s_dm_neg) / atr;
    dx_curr = (Math.abs(di_pos - di_neg) / Math.abs(di_pos + di_neg)) * 100;
    dx_sum += dx_curr;

    if (i === dm_period + adx_period - 1) {
      // we are at first adx value here.
      adx.Date.push(data.Date.at(i));
      adx.adx.push(dx_sum / 14);
    }
    if (i >= dm_period + adx_period) {
      // now use prior adx values and dx_curr to update next adx value
      adx.Date.push(data.Date.at(i));
      adx.adx.push((adx.adx.at(-1) * 13 + dx_curr) / 14);
    }
  }

  return adx;
}
