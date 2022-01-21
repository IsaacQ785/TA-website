import { StockData } from "../pages/chart";

export function process50ma(data: StockData) {
  const keys = ["close", "Volume", "Open", "High", "Low"];
  var tmp_50ma: StockData = {
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
    for (var i = 0; i < 49; i++) {
      key_sum += Number(data[key][i]);
    }
    return key_sum;
  }

  if (data.Date.length >= 50) {
    for (let i = 0; i <= data.Date.length - 50; i++) {
      tmp_50ma.Date.push(data.Date.at(i + 49));

      initial_sums.close += Number(data.close.at(i + 49));
      tmp_50ma.close.push(((initial_sums.close)/50).toString());
      initial_sums.close -= Number(data.close.at(i));

      initial_sums.Volume += Number(data.Volume.at(i + 49));
      tmp_50ma.Volume.push(((initial_sums.Volume)/50).toString());
      initial_sums.Volume -= Number(data.Volume.at(i));

      initial_sums.Open += Number(data.Open.at(i + 49));
      tmp_50ma.Open.push(((initial_sums.Open)/50).toString());
      initial_sums.Open -= Number(data.Open.at(i));

      initial_sums.High += Number(data.High.at(i + 49));
      tmp_50ma.High.push(((initial_sums.High)/50).toString());
      initial_sums.High -= Number(data.High.at(i));

      initial_sums.Low += Number(data.Low.at(i + 49));
      tmp_50ma.Low.push(((initial_sums.Low)/50).toString());
      initial_sums.Low -= Number(data.Low.at(i));
    }
  }
  console.log(tmp_50ma)
  return tmp_50ma;
}
