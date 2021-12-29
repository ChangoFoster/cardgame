import { useReducer } from 'react'

//Need to add actions
//https://kentcdodds.com/blog/the-state-reducer-pattern-with-react-hooks/
const actionTypes = {
  snap: 'snap',
  takeTurn: 'takeTurn',
  updateAllCards: 'udateAllCards',
  updateCards: 'updateCards',
  get: 'get',
}

const playersReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.get:
      return state
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const playersInit = [
  { name: 'one', cards: [], turn: true, score: 0 },
  { name: 'two', cards: [], turn: false, score: 0 },
]

const usePlayers = () => {
  const [players, dispatch] = useReducer(playersReducer, playersInit)

  const get = () => dispatch({ type: actionTypes.get })

  return { players, get }
}

export default usePlayers
