import React from 'react'
import propTypes from 'prop-types'

import Card from './Card'

const CardList = ({ cards }) => (
  <ul>
    {cards.map(card => (
      <Card key={card.code} card={card} />
    ))}
  </ul>
)

CardList.propTypes = {
  cards: propTypes.array,
}

export default CardList
