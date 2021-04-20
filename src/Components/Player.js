import React from 'react'
import propTypes from 'prop-types'

import CardList from './CardList'
import PlayButtons from './PlayButtons'

const Player = ({ name, cards, score, turn }) => {
  if (!name || cards === undefined) {
    return null
  }

  return (
    <div className="playColumn">
      <h2>{name}</h2>
      <p>Score: {score}</p>
      <p>Remaining: {cards.length}</p>
      <PlayButtons cards={cards.slice(0,1)} name={name} turn={turn} />
      <CardList cards={cards.slice(0,1)} />
    </div>
  )
}

Player.propTypes = {
  name: propTypes.string,
  cards: propTypes.array,
  score: propTypes.number,
  turn: propTypes.bool
}

export default Player
