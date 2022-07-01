import { StockData } from '../pages/chart'

export function calculateAccDis (data: StockData) {
  const accDis = {
    Date: [],
    accDis: []
  }

  if (data.close.length === 0) {
    return accDis
  }

  let mfm = 0
  let mfv = 0
  let pv = data.Volume.at(0)

  mfm =
    (data.close.at(0) - data.Low.at(0) - (data.High.at(0) - data.close.at(0))) /
    (data.High.at(0) - data.Low.at(0))

  mfv = mfm * pv
  accDis.Date.push(data.Date.at(0))
  accDis.accDis.push(mfv)

  for (let i = 0; i < data.close.length; i++) {
    pv += data.Volume.at(i)
    mfm =
      (data.close.at(i) -
        data.Low.at(i) -
        (data.High.at(i) - data.close.at(i))) /
      (data.High.at(i) - data.Low.at(i))
    mfv = pv * mfm

    accDis.Date.push(data.Date.at(i))
    accDis.accDis.push(accDis.accDis.at(-1) + mfv)
  }
  return accDis
}
