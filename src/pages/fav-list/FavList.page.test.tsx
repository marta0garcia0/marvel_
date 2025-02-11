import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import FavListPage from './FavList.page';
import { useFav } from '../../context/fav/FavContext';
import { useCharacter } from '../../context/characters/CharactersContext';
import { useNavigate } from 'react-router-dom';

jest.mock('../../context/fav/FavContext', () => ({
  useFav: jest.fn(),
}));

jest.mock('../../context/characters/CharactersContext', () => ({
  useCharacter: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  BrowserRouter: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../../components/filter/Filter.component', () => ({
  __esModule: true,
  FilterComponent: ({ onChange }: any) => (
    <input
      type="text"
      placeholder="Filter"
      onChange={e => onChange(e.target.value)}
    />
  ),
}));

jest.mock('../../components/card/Card.component', () => ({
  __esModule: true,
  CardComponent: ({ character, onClick }: any) => (
    <div onClick={() => onClick(character.id)}>{character.name}</div>
  ),
}));

jest.mock('./../../constants', () => ({
  ENVIRONMENT: 'test',
  VITE_PUBLIC_KEY: 'mockedApiKey',
  BASE_URL: '/',
}));

describe('FavListPage', () => {
  const mockNavigate = jest.fn();
  const mockUseFav = useFav as jest.Mock;
  const mockUseCharacter = useCharacter as jest.Mock;

  beforeEach(() => {
    mockNavigate.mockClear();

    mockUseFav.mockReturnValue({ favs: ['1', '2'] });
    mockUseCharacter.mockReturnValue({
      characters: [
        { id: '1', name: 'Character 1' },
        { id: '2', name: 'Character 2' },
        { id: '3', name: 'Character 3' },
      ],
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('should render the favorites correctly', () => {
    render(
      <Router>
        <FavListPage />
      </Router>
    );

    expect(screen.getByText('FAVORITES')).toBeInTheDocument();
    expect(screen.getByText('Character 1')).toBeInTheDocument();
    expect(screen.getByText('Character 2')).toBeInTheDocument();
    expect(screen.queryByText('Character 3')).not.toBeInTheDocument();
  });

  it('should navigate to character details when a card is clicked', () => {
    render(
      <Router>
        <FavListPage />
      </Router>
    );

    fireEvent.click(screen.getByText('Character 1'));

    expect(mockNavigate).toHaveBeenCalledWith('/characters/1', {
      replace: true,
    });
  });

  it('should filter characters based on search input', async () => {
    render(
      <Router>
        <FavListPage />
      </Router>
    );

    expect(screen.getByText('Character 1')).toBeInTheDocument();
    expect(screen.getByText('Character 2')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Filter'), {
      target: { value: '2' },
    });

    await waitFor(() => expect(screen.queryByText('Character 1')).toBeNull());
    expect(screen.getByText('Character 2')).toBeInTheDocument();
  });
});
