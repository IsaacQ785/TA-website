export default function unpack (rows, key) {
  return rows.map(function (row) {
    if (key === 'Date') {
      return row[key]
    }
    return key !== 'Stock-ticker' ? Number(row[key].replace(',', '')) : row[key]
  })
}
