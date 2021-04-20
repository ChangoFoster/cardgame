import React from 'react'
import propTypes from 'prop-types'

const Card = ({ card }) => (
  <li>
    <img alt={card.code} src={card.img} />
  </li>
)

Card.propTypes = {
  card: propTypes.object
}

export default Card
