import React from 'react'
import propTypes from 'prop-types'

import useDeck from '../Utils/useDeck'

const PlayButton = ({ cards, name, turn }) => {
  const { playCards, snap } = useDeck()

  return (
    <div className="playButtons">
      <button onClick={() => snap(name)}>Snap</button>

      {turn && cards && cards.length > 0 && (
        <button onClick={() => playCards(name, cards)}>
          {`Play ${name}`}
        </button>
      )}

    </div>
  )
}

PlayButton.propTypes = {
  cards: propTypes.array,
  name: propTypes.string,
  turn: propTypes.bool,
}

export default PlayButton
