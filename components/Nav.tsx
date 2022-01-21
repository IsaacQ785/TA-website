import Link from 'next/link';

import styles from "../styles/Nav.module.scss";

export default function Nav() {
    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img
            width="112"
            height="40"
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
          <a className="navbar-item" href="/">
            Home
          </a>

          <a className="navbar-item" href="/chart">
            Charts
          </a>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <a className="button is-primary">
                <strong>Sign up</strong>
              </a>
              <a className="button is-light">Log in</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    );
}