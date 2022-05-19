import React, { useEffect, useState } from 'react'

const RawDataTable = (props) => {
  const [v_data, setv_data] = useState(undefined)
  const [clientSide, setClientSide] = useState(false)
  console.log(props.data)
  useEffect(() => {
    console.log(props.data)
    setClientSide(true)
    setv_data(props.data)
  }, [props.data])

  return clientSide
    ? (
    <table className="table">
      <thead>
        <tr>
          {Object.keys(props.data[0]).map((value) =>
            value !== '_id'
              ? (
              <th>
                <abbr title={value}>{value}</abbr>
              </th>
                )
              : null
          )}
        </tr>
      </thead>
      <tbody>
        {v_data.map((value) => (
          <tr>
            <td>{value.Date}</td>
            <td>{value['Close/Last']}</td>
            <td>{value.Volume}</td>
            <td>{value.Open}</td>
            <td>{value.High}</td>
            <td>{value.Low}</td>
          </tr>
        ))}
      </tbody>
    </table>
      )
    : null
}

export default RawDataTable
