import '../styles/globals.scss'
// eslint-disable-next-line no-use-before-define
import React from 'react'
// import PropTypes from 'prop-types'
import { SessionProvider } from 'next-auth/react'

function MyApp ({ Component, pageProps }) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

// MyApp.PropTypes = {
//   Component: PropTypes.ob
// }

export default MyApp
