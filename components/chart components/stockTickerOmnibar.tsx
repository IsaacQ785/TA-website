import React, { useState } from 'react'
import styles from '../../styles/Home.module.scss'
import filterTickers from '../../helper/filterTickers'
import {
  Button,
  H5,
  HotkeysTarget2,
  KeyCombo,
  MenuItem,
  Position,
  Switch,
  Toaster
} from '@blueprintjs/core'
import {
  Example,
  handleBooleanChange,
  IExampleProps
} from '@blueprintjs/docs-theme'
import { Omnibar } from '@blueprintjs/select'

const StockOmnibar = Omnibar.ofType<string>()

const StockSearchBar2 = (props) => {
  // initialise key variables
  const [ticker, setTicker] = useState('')
  const [viewedTicker, setViewedTicker] = useState('AAPL')
  const [validTickers, setValidTickers] = useState(props.tickers)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // omnibar
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [resetOnSelect, setResetOnSelect] = useState(true)

  let toaster: Toaster

  // check for enter key press
  function pressEnter (e) {
    if (e.keyCode === 13) {
      handleRequest(e)
    }
  }

  const handleClick = (tick) => {
    setIsOpen(true)
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleRequest = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // reset error and message
    setError('')
    setMessage('')

    // fields check
    if (!ticker) return setError('All fields are required')

    const response = await fetch('/api/stock_data?' + ticker, {
      method: 'GET'
    })

    const trace = await response.json()

    if (trace.success) {
      setViewedTicker(ticker)
      setTicker('')
      props.setStockData(trace.message)
      return setMessage(ticker)
    } else {
      return setError(trace.message)
    }
  }

  const handleResetChange = () => {
    setResetOnSelect(!resetOnSelect)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const refHandlers = {
    toaster: (ref: Toaster) => (toaster = ref)
  }

  const renderOptions = () => {
    return (
      <>
        <H5>Props</H5>
        <Switch
          label="Reset on select"
          checked={resetOnSelect}
          onChange={handleResetChange}
        />
      </>
    )
  }

  return (
      <HotkeysTarget2
        hotkeys={[
          {
            combo: 'shift + o',
            global: true,
            label: 'Show Omnibar',
            onKeyDown: handleToggle,
            // prevent typing "O" in omnibar input
            preventDefault: true
          }
        ]}
      >
        <Example options={renderOptions()} {...props}>
          <span>
            <Button text="Click to show Omnibar" onClick={handleClick} />
            {' or press '}
            <KeyCombo combo="shift + o" />
          </span>

          {/* <StockOmnibar
            {...validTickers}
            isOpen={isOpen}
            resetOnSelect={resetOnSelect}
            noResults={<MenuItem disabled={true} text="No results." />}
            onItemSelect={handleRequest}
            onClose={handleClose}
          /> */}
          <Omnibar items={props.tickers}
          itemRenderer={null}
          isOpen={true}
          onItemSelect={handleRequest}/>
          {/* <Toaster position={Position.TOP} ref={refHandlers.toaster} /> */}
        </Example>
      </HotkeysTarget2>
  )
}

export default StockSearchBar2
