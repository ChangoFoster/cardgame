import React from 'react'

import useDeck from '../Utils/useDeck'

import Player from './Player'

const PlayerList = () => {
  const { players } = useDeck()

  if (!players) {
    return null
  }

  return (<>
    {players.map((player) => <Player key={player.name} {...player} />)}
  </>)
}

export default PlayerList
