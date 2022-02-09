import React from 'react'

export default function Ticker ({ ticker }) {
  return (
        <>
            <li>
                <h3>{ticker['Stock-ticker']}</h3>
                <br />
            </li>
        </>
  )
}
