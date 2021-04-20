import axios from 'axios'

const url = 'https://deckofcardsapi.com/api'

const create = async () => {
  const { data } = await axios.get(`${url}/deck/new/draw/?count=52`)
  return data
}

const addToPile = async (deck_id, pile_name, cards) => {
  const toCardString = cards.map(({ code }) => code).toString()

  const { data } = await axios.get(
    `${url}/deck/${deck_id}/pile/${pile_name}/add/?cards=${toCardString}`
  )

  return data
}

export { create, addToPile }
