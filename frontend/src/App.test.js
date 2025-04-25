import { render, screen } from '@testing-library/react';
import App from './App';

test('renders chat app', () => {
  render(<App />);
  const titleElement = screen.getByText(/Chat avec StreamChat/i);
  expect(titleElement).toBeInTheDocument();
});