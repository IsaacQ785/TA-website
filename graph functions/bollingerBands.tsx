import { StockData } from "../pages/chart";
import calculateMean from "./hiddenCalculations/calculateMean";
import calculateMeans from "./hiddenCalculations/calculateMeans";

export interface bollBandData {
  Date: string[];
  extremes: number[];
  middle: number[];
  extreme_dates: number[];
}

export const bollingerBands = (data: StockData) => {
  
  var bollBand: bollBandData = {
    Date: [],
    extremes: [],
    middle: [],
    extreme_dates: [],
  };

   // Calculate variance
  const calculateVariances = (closes: number[], means: number[], ma_length: number): number[] => {
    var variances = [];
    for (var j = 0; j < means.length; j++) {
      var squareDiffs;
      squareDiffs = closes.slice(j, j + ma_length).map((value) => {
        const diff = value - means[j];
        return diff * diff;
      });
      variances.push(calculateMean(squareDiffs));
    }
    return variances;
  };

  const calculateBollSD = (closes: number[], means: number[]) => {
    return calculateVariances(closes, means, 20).map((value) => {
      return 2 * Math.sqrt(value);
    });
  };

  const calculateBands = (close: number[], Dates: string[], ma_length: number) => {
    const means = calculateMeans(close, 20);
    const boll_devs = calculateBollSD(close, means);
    var top = [];
    var bottom = [];
    const extremes = [];
    const extreme_dates = [];
    const dates = [];

    for (var i = 0; i < boll_devs.length; i++) {
      top.push(means[i] + boll_devs[i]);
      bottom.push(means[i] - boll_devs[i]);
    }

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
  };

  if (data.close.length > 20) {
    [
      bollBand.Date,
      bollBand.middle,
      bollBand.extremes,
      bollBand.extreme_dates,
    ] = calculateBands(data.close, data.Date, 20);
  }
  return bollBand;
};
