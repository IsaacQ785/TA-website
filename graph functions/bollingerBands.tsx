import { StockData } from "../pages/chart";

export interface bollBandData {
  Date: string[];
  extremes: number[];
  middle: number[];
  extreme_dates: number[];
}

export function bollingerBands(data: StockData) {
  var bollBand: bollBandData = {
    Date: [],
    extremes: [],
    middle: [],
    extreme_dates: [],
  };

  if (data.close.length > 20) {
    [
      bollBand.Date,
      bollBand.middle,
      bollBand.extremes,
      bollBand.extreme_dates,
    ] = calculateBands(data.close, data.Date);
  }
  return bollBand;
}
const ma_length = 20;
const calculateMeans = (closes: any[]): number[] => {
  var means = [];
  for (var j = 0; j < closes.length - ma_length; j++) {
    means.push(0);
  }
  for (var i = 0; i < ma_length; i++) {
    for (var j = 0; j < closes.length - ma_length; j++) {
      means[j] += Number(closes[i + j]) / ma_length;
    }
  }
  return means;
};

const calculateMean = (closes: number[]): number => {
  var mean = 0;
  for (var j = 0; j < ma_length; j++) {
    mean += closes[j];
  }
  return mean / ma_length;
};

// Calculate variance
const calculateVariances = (closes: string[], means: number[]): number[] => {
  var variances = [];
  for (var j = 0; j < means.length; j++) {
    var squareDiffs;
    squareDiffs = closes.slice(j, j + ma_length).map((value) => {
      const diff = Number(value) - means[j];
      return diff * diff;
    });
    variances.push(calculateMean(squareDiffs));
  }
  return variances;
};

const calculateBollSD = (closes: string[], means: number[]) => {
  return calculateVariances(closes, means).map((value) => {
    return 2 * Math.sqrt(value);
  });
};

function calculateBands(close: string[], Dates: string[]) {
  const means = calculateMeans(close);
  const boll_devs = calculateBollSD(close, means);
  var top = [];
  var bottom = [];
  for (var i = 0; i < boll_devs.length; i++) {
    top.push(means[i] + boll_devs[i]);
    bottom.push(means[i] - boll_devs[i]);
  }
  const extremes = [];
  const extreme_dates = [];
  const dates = [];
  for (var i = 0; i < bottom.length; i++) {
    extremes.push(top[i]);
    extreme_dates.push(Dates[i + ma_length]);
    dates.push(Dates[i + ma_length]);
  }
  for (var i = bottom.length - 1; i >= 0; i--) {
    extremes.push(bottom[i]);
    extreme_dates.push(Dates[i + ma_length]);
  }

  return [dates, means, extremes, extreme_dates];
}
