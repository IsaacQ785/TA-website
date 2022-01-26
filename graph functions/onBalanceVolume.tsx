import { StockData } from "../pages/chart";

export function onBalanceVolume(data: StockData) {
  let onBalVolume = {
    date: [data.Date[0]],
    OBV: [0],
  };

  for (let i = 1; i < data.close.length; i++) {
    onBalVolume.date.push(data.Date.at(i));
    let pos;
    if (data.close.at(i) > data.close.at(i - 1)) {
      pos = 1;
    } else if (data.close.at(i) < data.close.at(i - 1)) {
      pos = -1;
    } else {
      pos = 0;
    }
    onBalVolume.OBV.push(
      onBalVolume.OBV.at(i - 1) + Number(data.Volume.at(i)) * pos
    );
  }
  return onBalVolume;
}
