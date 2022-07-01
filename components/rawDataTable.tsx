// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const RawDataTable = (props) => {
  const [vData, setvData] = useState(undefined)
  const [clientSide, setClientSide] = useState(false)
  useEffect(() => {
    setClientSide(true)
    setvData(props.data)
  }, [props.data])

  return clientSide
    ? (
    <table style={ { color: 'blue', background: 'lightblue', border: 'groove black' } } className="table is-hoverable is-fullwidth is-bordered is-scrollable">
      <thead>
        <tr>
          {Object.keys(props.data[0]).map((value) =>
            value !== '_id'
              ? (
              <th key={value}>
                <abbr title={value}>{value}</abbr>
              </th>
                )
              : null
          )}
        </tr>
      </thead>
      <tbody>
        {vData.map((value) => (
          <tr key={value._id}>
            <th title={value.Date}>{value.Date}</th>
            <td title={value['Close/Last']}>{value['Close/Last']}</td>
            <td title={value.Volume}>{value.Volume}</td>
            <td title={value.Open}>{value.Open}</td>
            <td title={value.High}>{value.High}</td>
            <td title={value.Low}>{value.Low}</td>
          </tr>
        ))}
      </tbody>
    </table>
      )
    : null
}

RawDataTable.propTypes = {
  data: PropTypes.array
}

export default RawDataTable
