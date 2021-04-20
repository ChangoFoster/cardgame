import React from 'react'
import useDeck from './Utils/useDeck'

import DeckList from './Components/DeckList'
import Notification from './Components/Notification'
import PlayerList from './Components/PlayerList'

import './App.css'

const App = () => {
  const { loading } = useDeck()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="app">
      <h1>Game of Snap</h1>
      <Notification />
      <div className="wrapper">
        <DeckList />
        <PlayerList />
      </div>
    </div>
  )
}

export default App
