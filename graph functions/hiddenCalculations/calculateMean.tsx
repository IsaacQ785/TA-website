const calculateMean = (data: number[]): number => {
  var mean = 0;
  for (var j = 0; j < data.length; j++) {
    mean += data[j];
  }
  return mean / data.length;
};

export default calculateMean;
