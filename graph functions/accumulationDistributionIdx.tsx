import { StockData } from "../pages/chart";

export function calculateAccDis(data: StockData) {
  let accDis = {
    Date: [],
    accDis: [],
  };

  if (data.close.length === 0) {
    return accDis;
  }

  let mfm = 0,
    mfv = 0,
    pv = Number(data.Volume.at(0));

  mfm =
    (Number(data.close.at(0)) -
      Number(data.Low.at(0)) -
      (Number(data.High.at(0)) - Number(data.close.at(0)))) /
    (Number(data.High.at(0)) - Number(data.Low.at(0)));

  mfv = mfm * pv;
  accDis.Date.push(data.Date.at(0));
  accDis.accDis.push(mfv);

  for (let i = 0; i < data.close.length; i++) {
    pv += Number(data.Volume.at(i));
    mfm =
      (Number(data.close.at(i)) -
        Number(data.Low.at(i)) -
        (Number(data.High.at(i)) - Number(data.close.at(i)))) /
      (Number(data.High.at(i)) - Number(data.Low.at(i)));
    mfv = pv * mfm;

    accDis.Date.push(data.Date.at(i));
    accDis.accDis.push(accDis.accDis.at(-1) + mfv);
  }
  return accDis;
}
