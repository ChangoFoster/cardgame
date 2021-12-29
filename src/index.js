import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { DeckProvider } from './Utils/useDeck'

ReactDOM.render(
  <React.StrictMode>
    <DeckProvider>
      <App />
    </DeckProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
