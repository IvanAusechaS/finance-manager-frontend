import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument();
  });

  it('should display initial count of 0', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument();
  });

  it('should increment count when button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const button = screen.getByRole('button', { name: /count is 0/i });
    await user.click(button);
    
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument();
  });

  it('should render Vite and React logos', () => {
    render(<App />);
    
    const viteLogo = screen.getByAltText(/Vite logo/i);
    const reactLogo = screen.getByAltText(/React logo/i);
    
    expect(viteLogo).toBeInTheDocument();
    expect(reactLogo).toBeInTheDocument();
  });

  it('should have correct links for logos', () => {
    render(<App />);
    
    const viteLink = screen.getByRole('link', { name: /Vite logo/i });
    const reactLink = screen.getByRole('link', { name: /React logo/i });
    
    expect(viteLink).toHaveAttribute('href', 'https://vite.dev');
    expect(reactLink).toHaveAttribute('href', 'https://react.dev');
  });
});
