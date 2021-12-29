import React, { useCallback, useEffect, useState } from 'react'
import * as deckService from './deck'

const playersInit = [
  { name: 'one', cards: [], turn: true, score: 0 },
  { name: 'two', cards: [], turn: false, score: 0 },
]

//check if a card is in a pile
const isInPile = (pile, card) => {
  return pile.includes(card)
}

//Return current cards plus cards in the new pile? I think
const dedupeCards = (currentPile, newPile) => {
  return currentPile.filter((card) => !isInPile(newPile, card))
}

//Get a slice of cards from a deck for a player
const getDeckSlice = (deck, noOfPlayers, position) => {
  const { cards } = deck
  const cardsPerPlayer = cards.length / noOfPlayers

  return cards.slice(position * cardsPerPlayer, (position + 1) * cardsPerPlayer)
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

  const createGame = async () => {
    try {
      const updatedPlayers = players.map((player, idx) => ({
        ...player,
        cards: getDeckSlice(deck, players.length, idx),
      }))

      Promise.all(
        updatedPlayers.map(async ({ name, cards }) => {
          await deckService.addToPile(deck.deck_id, name, cards)
        })
      )

      setPlayers(updatedPlayers)
      setDeck({ ...deck, cards: [] })
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

      setDeck(deck => ({ ...deck, cards: dedupeCards(deck.cards, cards) }))
      setPlayers(players.map(player => name !== player.name ? player : { ...player, cards }))

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
      setPlayers(players =>
        players.map((player) => {
          if (name !== player.name) {
            return {
              ...player,
              turn: true
            }
          } else {
            return {
              ...player,
              turn: false,
              cards: dedupeCards(player.cards, cards)
            }
          }
        })
      )
    } catch (error) {
      setError(String(error))
    }
  }

  const snap = (name) => {
    const { cards } = deck

    if (!cards || cards.length < 2) {
      setWin(false)
      setPlayers(
        players.map((player) =>
          name !== player.name ? { ...player, score: player.score + 1 } : player
        )
      )
      return
    }

    const cardOne = cards[cards.length - 1].code.charAt(0)
    const cardTwo = cards[cards.length - 2].code.charAt(0)

    if (cardOne !== cardTwo) {
      setWin(false)
      setPlayers(
        players.map((player) =>
          name !== player.name ? { ...player, score: player.score + 1 } : player
        )
      )
    }

    if (cardOne === cardTwo) {
      setWin(true)
      setPlayers(
        players.map((player) =>
          name !== player.name ? player : { ...player, score: player.score + 1 }
        )
      )
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
