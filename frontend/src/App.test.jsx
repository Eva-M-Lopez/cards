import { render, screen } from '@testing-library/react'
import App from './App'

test('renders LOGIN text', () => {
  render(<App />)
  expect(screen.getByText(/LOGIN/i)).toBeInTheDocument()
})

test('username input exists', () => {
  render(<App />)
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
})

test('password input exists', () => {
  render(<App />)
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
})

test('login button exists', () => {
  render(<App />)
  expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
})


test('app renders without crashing', () => {
  render(<App />);
});

test('login button has correct class', () => {
  render(<App />);
  const button = screen.getByRole('button', { name: /log in/i });

  expect(button).toHaveClass('login-button');
});
