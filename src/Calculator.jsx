import { useState } from 'react'
import './Calculator.css'

const BUTTONS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
]

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState(null)
  const [op, setOp] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit)
    }
  }

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPrev(null)
    setOp(null)
    setWaitingForOperand(false)
  }

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1))
  }

  const percentage = () => {
    setDisplay(String(parseFloat(display) / 100))
  }

  const calculate = (a, b, operator) => {
    switch (operator) {
      case '+': return a + b
      case '−': return a - b
      case '×': return a * b
      case '÷': return b !== 0 ? a / b : 'Error'
      default: return b
    }
  }

  const handleOperator = (nextOp) => {
    const current = parseFloat(display)

    if (nextOp === '=') {
      if (op && prev !== null) {
        const result = calculate(prev, current, op)
        setDisplay(String(parseFloat(result.toPrecision(12))))
        setPrev(null)
        setOp(null)
        setWaitingForOperand(true)
      }
      return
    }

    if (op && !waitingForOperand) {
      const result = calculate(prev, current, op)
      setDisplay(String(parseFloat(result.toPrecision(12))))
      setPrev(parseFloat(result.toPrecision(12)))
    } else {
      setPrev(current)
    }

    setOp(nextOp)
    setWaitingForOperand(true)
  }

  const handleButton = (btn) => {
    if (btn >= '0' && btn <= '9') return inputDigit(btn)
    if (btn === '.') return inputDot()
    if (btn === 'C') return clear()
    if (btn === '±') return toggleSign()
    if (btn === '%') return percentage()
    handleOperator(btn)
  }

  const isOperator = (btn) => ['÷', '×', '−', '+', '='].includes(btn)
  const isTopRow = (btn) => ['C', '±', '%'].includes(btn)

  return (
    <div className="calculator-wrap">
    <h1 className="calculator-title">Calculator</h1>
    <div className="calculator">
      <div className="display">
        <span className="display-text">{display}</span>
      </div>
      <div className="buttons">
        {BUTTONS.map((row, ri) => (
          <div key={ri} className="row">
            {row.map((btn) => (
              <button
                key={btn}
                className={[
                  'btn',
                  isOperator(btn) ? 'btn-operator' : '',
                  isTopRow(btn) ? 'btn-top' : '',
                  btn === '0' ? 'btn-wide' : '',
                  btn === op ? 'btn-active' : '',
                ].join(' ')}
                onClick={() => handleButton(btn)}
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}
