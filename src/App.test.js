import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('the app', () => {
  it('renders learn react link', () => {
    expect.assertions(1)
    render(<App />)
    const linkElement = screen.getByText(/Hello/i)
    expect(linkElement).toBeInTheDocument()
  })
})
