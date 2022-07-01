// eslint-disable-next-line no-use-before-define
import React from 'react'
import Image from 'next/image'
import { signIn, signOut, useSession } from 'next-auth/react'

const Nav = () => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a href="/">
          <Image
            width="150"
            height="90"
            alt="Website Logo"
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbestbrokerindia.com%2Fblog%2Fwp-content%2Fuploads%2F2019%2F05%2FTechnical-Analysis-Basics.jpg&f=1&nofb=1"
          />
        </a>

        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <div className="navbar-item is-tab">
            <a href="/"><strong>Home</strong></a>
          </div>
          <div className="navbar-item is-tab">
            <a href="/chart"><strong>Charts</strong></a>
          </div>
          <div className="navbar-item is-tab">
            <a href="/rawdata"><strong>See Raw Data</strong></a>
          </div>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {!session && (
                <a
                  className="button is-primary"
                  href="/api/auth/signin"
                  onClick={(e) => {
                    e.preventDefault()
                    console.log(session)
                    signIn()
                  }}
                >
                  <strong>Sign In</strong>
                </a>
              )}
              {session?.user && (
                <>
                  <a
                    href={'/api/auth/signout'}
                    className="button is-primary"
                    onClick={(e) => {
                      e.preventDefault()
                      console.log(session)
                      signOut()
                    }}
                  >
                    Sign out
                  </a>
                  {session.user.image && (
                    <span
                      style={{
                        // backgroundImage: `url('${session.user.image}')`,
                        // padding:
                      }}
                      // className={styles.avatar}
                    />
                  )}
                  <span style={{padding: '10px' }}
                  // className={styles.signedInText}
                  >
                    <small>Signed in as</small>
                    <br />
                    <strong>{session.user.name ?? session.user.email}</strong>
                  </span>

                  {session.user.image && (
                    <Image width="50" height="50" src={session.user.image} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav
