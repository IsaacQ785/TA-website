// eslint-disable-next-line no-use-before-define
import React, { FormEvent } from 'react'

const SignUpForm = () => {
  return (
    <div className="tile is-ancestor">
      <div className="tile is-vertical is-4">
        <div className="tile">
          <div className="tile is-parent is-vertical">
            <p className="tile is-child">
              <input
                className="input is-large"
                type="email"
                placeholder="Email"
              />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check"></i>
              </span>
            </p>
            <p className="tile is-child">
              <input
                className="input is-large"
                type="password"
                placeholder="Password"
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="tile is-vertical is-4">
        <div className="tile">
          <div className="tile is-parent is-vertical">
            <p className="tile is-child">
              <input
                className="input is-large"
                type="email"
                placeholder="Email"
              />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check"></i>
              </span>
            </p>
            <p className="tile is-child">
              <input
                className="input is-large"
                type="password"
                placeholder="Password"
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="tile is-vertical is-2">
        <div className="tile">
          <div className="tile is-parent is-vertical">
            <p className="tile is-child">
              <input
                className="input is-large"
                type="email"
                placeholder="Email"
              />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check"></i>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpForm
