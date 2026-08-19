import { render, screen } from '@testing-library/react';
import App from './App';

test('renders user management heading', () => {
  render(<App />);
  expect(screen.getByText(/user management app/i)).toBeInTheDocument();
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});
