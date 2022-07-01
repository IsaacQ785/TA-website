// eslint-disable-next-line no-use-before-define
import React from 'react'
import Head from 'next/head'
import Nav from '../components/Nav'
import SignUpForm from '../components/User Components/signup'

const SignUp = () => {
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>
      <Nav />
      <main>
        <SignUpForm />
      </main>
    </div>
  )
}

export default SignUp
