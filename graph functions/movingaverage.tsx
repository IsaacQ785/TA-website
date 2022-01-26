import { StockData } from "../pages/chart";

export function processma(data: StockData, days: number) {
  var tmp_daysma: StockData = {
    Date: [],
    close: [],
    Volume: [],
    Open: [],
    High: [],
    Low: [],
  };
  var initial_sums = {
    close: sum("close"),
    Volume: sum("Volume"),
    Open: sum("Open"),
    High: sum("High"),
    Low: sum("Low"),
  };
  function sum(key) {
    var key_sum: number = 0.0;
    for (var i = 0; i < days-1; i++) {
      key_sum += Number(data[key][i]);
    }
    return key_sum;
  }

  if (data.Date.length >= days) {
    for (let i = 0; i <= data.Date.length - days; i++) {
      tmp_daysma.Date.push(data.Date.at(i + days-1));

      initial_sums.close += Number(data.close.at(i + days-1));
      tmp_daysma.close.push((initial_sums.close / days).toString());
      initial_sums.close -= Number(data.close.at(i));

      initial_sums.Volume += Number(data.Volume.at(i + days-1));
      tmp_daysma.Volume.push((initial_sums.Volume / days).toString());
      initial_sums.Volume -= Number(data.Volume.at(i));

      initial_sums.Open += Number(data.Open.at(i + days-1));
      tmp_daysma.Open.push((initial_sums.Open / days).toString());
      initial_sums.Open -= Number(data.Open.at(i));

      initial_sums.High += Number(data.High.at(i + days-1));
      tmp_daysma.High.push((initial_sums.High / days).toString());
      initial_sums.High -= Number(data.High.at(i));

      initial_sums.Low += Number(data.Low.at(i + days-1));
      tmp_daysma.Low.push((initial_sums.Low / days).toString());
      initial_sums.Low -= Number(data.Low.at(i));
    }
  }
  console.log(tmp_daysma);
  return tmp_daysma;
}
