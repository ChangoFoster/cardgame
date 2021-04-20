import React from 'react'

import useDeck from '../Utils/useDeck'

import CardList from './CardList'

const DeckList = () => {
  const { createGame, deck, win } = useDeck()

  return (
    <div className="playColumn">
      <h2>Deck</h2>
      <p>{`Win: ${win}`}</p>
      <p>Size: {deck && deck.cards.length}</p>
      <div className="playButtons">
        <button onClick={async () => await createGame()}>
          Create game
        </button>
      </div>
      {deck && <CardList cards={deck.cards.slice(-2)} />}
    </div>
  )
}

export default DeckList
