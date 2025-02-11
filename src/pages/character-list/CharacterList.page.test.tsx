import '@testing-library/jest-dom';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import CharacterList from './CharacterList.page';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';
import { useCharacter } from '../../context/characters/CharactersContext';
import { getCharacters } from '../../services/api';

// Mock the dependencies
jest.mock('../../context/auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../context/characters/CharactersContext', () => ({
  useCharacter: jest.fn(),
}));

jest.mock('../../services/api', () => ({
  getCharacters: jest.fn(),
}));

jest.mock('../../components/card/Card.component', () => ({
  __esModule: true,
  CardComponent: ({ character }: any) => <div>{character.name}</div>,
}));

jest.mock('./../../constants', () => ({
  ENVIRONMENT: 'test',
  VITE_PUBLIC_KEY: 'mockedApiKey',
  BASE_URL: '/',
}));

describe('CharacterList', () => {
  const mockUpdateCharacters = jest.fn();
  const mockUpdateFilterCharacters = jest.fn();

  beforeEach(() => {
    // Reset mock implementations before each test
    jest.clearAllMocks();

    // Mock the context return values
    (useAuth as jest.Mock).mockReturnValue({
      ts: 'timestamp',
      hash: 'hash',
    });

    (useCharacter as jest.Mock).mockReturnValue({
      characters: [{ id: '1', name: 'Iron Man' }],
      characterInfo: { total: 100, count: 1 },
      updateCharacters: mockUpdateCharacters,
      updateFilterCharacters: mockUpdateFilterCharacters,
      filterCharacters: [],
      filterCharacterInfo: null,
    });

    (getCharacters as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => {
        resolve({
          results: [{ id: '1', name: 'Iron Man' }],
          total: 100,
          limit: 20,
        });
      });
    });
  });

  it('should render the component and display loading spinner initially', async () => {
    render(
      <Router>
        <CharacterList />
      </Router>
    );

    // Check for loading spinner initially
    expect(screen.getByAltText('Loading')).toBeInTheDocument();

    // Wait for the loading spinner to disappear
    await waitFor(() => {
      expect(screen.queryByAltText('Loading')).not.toBeInTheDocument();
    });
  });

  it('should render characters when data is fetched', async () => {
    render(
      <Router>
        <CharacterList />
      </Router>
    );

    // Wait for the character to appear
    await waitFor(() => {
      expect(screen.getByText('Iron Man')).toBeInTheDocument();
    });
  });

  it('should update the filter state and call updateFilterCharacters', async () => {
    render(
      <Router>
        <CharacterList />
      </Router>
    );

    const input = screen.getByPlaceholderText('SEARCH A CHARACTER...');

    // Simulate input change to filter characters
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Iron' } });
    });

    expect(mockUpdateFilterCharacters).toHaveBeenCalled();
  });

  it('should set loading to false after fetching characters', async () => {
    render(
      <Router>
        <CharacterList />
      </Router>
    );

    // Wait for the loading spinner to disappear
    await waitFor(() => {
      expect(screen.queryByAltText('Loading')).not.toBeInTheDocument();
    });

    // Verify that the character "Iron Man" is displayed
    expect(screen.getByText('Iron Man')).toBeInTheDocument();
  });

  it('should load more characters when the "more" button is clicked', async () => {
    render(
      <Router>
        <CharacterList />
      </Router>
    );

    // Wait for the initial character to be rendered
    await waitFor(() => {
      expect(screen.getByText('Iron Man')).toBeInTheDocument();
    });

    // Mock that the next call to getCharacters fetches a new character
    (getCharacters as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => {
        resolve({
          results: [{ id: '2', name: 'Captain America' }],
          total: 100,
          limit: 20,
        });
      });
    });
    await waitFor(() => {
      expect(screen.getByText('more')).toBeInTheDocument();

      const moreButton = screen.getByText('more');
      fireEvent.click(moreButton);
    });

    expect(getCharacters).toHaveBeenCalledTimes(2);
  });
});
