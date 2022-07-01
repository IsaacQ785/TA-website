// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const DownLoadData = (props) => {
  const [clientSide, setClientSide] = useState(false)
  useEffect(() => {
    setClientSide(true)
  }, [])

  return clientSide
    ? (
    <a className='button is-warning' href={'/'} download={props.ticker}>Download {props.ticker} Data</a>
      )
    : null
}

DownLoadData.propTypes = {
  data: PropTypes.array,
  ticker: PropTypes.string
}

export default DownLoadData
