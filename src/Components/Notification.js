import React from 'react'

import useDeck from '../Utils/useDeck'

const Notification = () => {
  const { win, error, setError, createDeck } = useDeck()

  if (error) {
    return (
      <div className="notification error">
        <p>{error}</p>
        <button onClick={() => setError()}>Dismiss</button>
      </div>
    )
  }

  if (win) {
    return (
      <div className="notification win">
        <p>You won! :)</p>
        <button onClick={() => createDeck()}>Reset deck</button>
      </div>
    )
  }

  if (win === false) {
    return (
      <div className="notification lose">
        <p>You lost! :(</p>
        <button onClick={() => createDeck()}>Reset deck</button>
      </div>
    )
  }

  return null
}

export default Notification
