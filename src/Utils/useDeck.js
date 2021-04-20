import React, { useCallback, useEffect, useState } from 'react'
import * as deckService from './deck'

const playersInit = [
  { name: 'one', cards: [], turn: true, score: 0 },
  { name: 'two', cards: [], turn: false, score: 0 },
]

//Move out logic to handle arrays of cards
const dedupeCards = (currentCards, newCards) => {
  return currentCards.filter((card) => !newCards.includes(card))
}

const DeckContext = React.createContext()

export const DeckProvider = (props) => {
  const [deck, setDeck] = useState()
  const [players, setPlayers] = useState(playersInit)
  const [error, setError] = useState()
  const [loading, setLoading] = useState()
  const [win, setWin] = useState()

  const createDeck = useCallback(async () => {
    setLoading(true)

    try {
      const deck = await deckService.create()

      setDeck(deck)
      setPlayers(playersInit)
      setWin()
      setLoading(false)
    } catch (error) {
      setError(String(error))
      setLoading(false)
    }
  }, [])

  //Hacky create game function, needs to be made generic
  const createGame = async () => {
    const slice1 = deck.cards.slice(0, 26)
    const slice2 = deck.cards.slice(26, 52)

    try {
      await deckService.addToPile(deck.deck_id, players[0].name, slice1)
      await deckService.addToPile(deck.deck_id, players[1].name, slice2)

      setDeck({ ...deck, cards: [] })
      setPlayers(
        players.map((p) => {
          if (p.name === players[0].name) {
            return { ...p, cards: slice1 }
          }

          if (p.name === players[1].name) {
            return { ...p, cards: slice2 }
          }

          return p
        })
      )
    } catch (error) {
      setError(String(error))
    }
  }

  const addToPile = async (name, cards) => {
    if (!deck || !cards || !name) {
      throw new Error(`Missing param: ${String(deck, cards, name)}`)
    }

    try {
      await deckService.addToPile(deck.deck_id, name, cards)

      setDeck({ ...deck, cards: dedupeCards(deck.cards, cards) })
      setPlayers(players.map((p) => (name !== p.name ? p : { ...p, cards })))
    } catch (error) {
      setError(String(error))
    }
  }

  const playCards = async (name, cards) => {
    if (!deck || !cards || !name) {
      throw new Error(`Missing param: ${String(deck, cards, name)}`)
    }

    try {
      await deckService.addToPile(deck.deck_id, 'deck', cards)

      setDeck({ ...deck, cards: deck.cards.concat(cards) })
      setPlayers(
        players.map((p) =>
          name !== p.name
            ? { ...p, turn: true }
            : { ...p, turn: false, cards: dedupeCards(p.cards, cards) }
        )
      )
    } catch (error) {
      setError(String(error))
    }
  }

  const snap = (name) => {
    const { cards } = deck

    if (!cards || cards.length < 2) {
      setWin(false)
      setPlayers(players.map(p => p.name !== name ? { ...p, score: p.score + 1 } : p))
      return
    }

    const cardValOne = cards[cards.length - 1].code.charAt(0)
    const cardValTwo = cards[cards.length - 2].code.charAt(0)

    if (cardValOne !== cardValTwo) {
      setWin(false)
      setPlayers(players.map(p => p.name !== name ? { ...p, score: p.score + 1 } : p))
    }

    if (cardValOne === cardValTwo) {
      setWin(true)
      setPlayers(players.map(p => p.name !== name ? p : { ...p, score: p.score + 1 }))
      return
    }
  }

  useEffect(() => {
    createDeck()
  }, [createDeck])

  return (
    <DeckContext.Provider
      value={{
        createDeck,
        createGame,
        addToPile,
        playCards,
        setError,
        snap,
        deck,
        players,
        loading,
        error,
        win,
      }}
      {...props}
    />
  )
}

const useDeck = () => {
  const context = React.useContext(DeckContext)

  if (context === undefined) {
    throw new Error('useDeck must be used with DeckProvider')
  }

  return context
}

export default useDeck
