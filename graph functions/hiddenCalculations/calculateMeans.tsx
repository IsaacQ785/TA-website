import calculateMean from "./calculateMean";

const calculateMeans = (data: number[], ma_length: number): number[] => {
  var means = [];

  for (var j = 0; j < data.length - ma_length; j++) {
    means.push(calculateMean(data.slice(j, j + ma_length)));
  }
  return means;
};

export default calculateMeans;
