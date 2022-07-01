const filterTickers = (ticker, tickers) => {
  const searchTerm = ticker.toLowerCase()
  return tickers.filter(function (t) {
    if (t.toLowerCase().indexOf(searchTerm) > -1) {
      return true
    } else {
      return false
    }
  })
}

export default filterTickers
