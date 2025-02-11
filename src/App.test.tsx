import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from './App';
import { useAuth } from './context/auth/AuthContext';
import { useFav } from './context/fav/FavContext';

jest.mock('./context/auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('./context/fav/FavContext', () => ({
  useFav: jest.fn(),
}));

jest.mock('./constants', () => ({
  ENVIRONMENT: 'test',
  VITE_PUBLIC_KEY: 'mockedApiKey',
  BASE_URL: '/',
}));

describe('App Component', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ updateHash: jest.fn() });
    (useFav as jest.Mock).mockReturnValue({ favs: [1, 2, 3] });
  });

  test('should render Menu and Routes correctly', () => {
    render(<App />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByAltText('Marvel')).toBeInTheDocument();
    expect(screen.getByAltText('likes')).toBeInTheDocument();
    expect(screen.getByAltText('Loading')).toBeInTheDocument();
  });

  test('should call updateHash on mount', () => {
    render(<App />);

    expect(useAuth().updateHash).toHaveBeenCalled();
  });
});
