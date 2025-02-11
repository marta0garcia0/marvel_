import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import CharacterInfo from './CharacterInfo.page';
import { BrowserRouter as Router } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';
import { useFav } from '../../context/fav/FavContext';
import { getCharacter, getComics } from '../../services/api';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('../../context/auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../context/fav/FavContext', () => ({
  useFav: jest.fn(),
}));

jest.mock('../../services/api', () => ({
  getCharacter: jest.fn(),
  getComics: jest.fn(),
}));

jest.mock('./../../constants', () => ({
  ENVIRONMENT: 'test',
  VITE_PUBLIC_KEY: 'mockedApiKey',
  BASE_URL: '/',
}));

describe('CharacterInfo Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useAuth as jest.Mock).mockReturnValue({
      ts: 'timestamp',
      hash: 'hashvalue',
    });

    (useFav as jest.Mock).mockReturnValue({
      favs: ['1'],
      updateFavs: jest.fn(),
    });

    (getCharacter as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => {
        resolve({
          results: [
            {
              id: '1',
              name: 'Iron Man',
              description: 'A wealthy industrialist and genius inventor.',
              thumbnail: {
                path: 'https://example.com/image',
                extension: 'jpg',
              },
              comics: {
                collectionURI: 'https://example.com/comics',
              },
            },
          ],
          total: 100,
          limit: 20,
        });
      });
    });

    (getComics as jest.Mock).mockResolvedValue({
      results: [
        {
          id: '101',
          title: 'Iron Man: The Beginning',
          modified: '2021-06-01T00:00:00Z',
          thumbnail: {
            path: 'https://example.com/comic-image',
            extension: 'jpg',
          },
        },
      ],
    });
  });

  it('should render the component correctly', async () => {
    render(
      <Router>
        <CharacterInfo />
      </Router>
    );

    // check the spinner
    expect(screen.getByAltText('Loading')).toBeInTheDocument();

    // Whait for the character to be loaded
    await waitFor(() => {
      expect(screen.getByText('Iron Man')).toBeInTheDocument();
      expect(
        screen.getByText('A wealthy industrialist and genius inventor.')
      ).toBeInTheDocument();
    });
  });

  // it('should render comics after fetching data', async () => {
  //   render(
  //     <Router>
  //       <CharacterInfo />
  //     </Router>
  //   );

  //   // Wait for comics to load
  //   await waitFor(() => {
  //     expect(screen.getByText('Iron Man: The Beginning')).toBeInTheDocument();
  //     expect(screen.getByText('2021')).toBeInTheDocument();
  //   });
  // });

  // it('should toggle the like status when clicking the heart icon', async () => {
  //   const mockUpdateFavs = jest.fn();

  //   (useFav as jest.Mock).mockReturnValue({
  //     favs: ['1'],
  //     updateFavs: mockUpdateFavs,
  //   });

  //   render(
  //     <Router>
  //       <CharacterInfo />
  //     </Router>
  //   );

  //   // Wait for the character to load
  //   await waitFor(() => {
  //     expect(screen.getByText('Iron Man')).toBeInTheDocument();
  //   });

  //   // Check that the heart icon exists
  //   const heartIcon = screen.getByAltText('like');

  //   // Click to change the state
  //   fireEvent.click(heartIcon);

  //   // Check that tue favs are updated
  //   expect(mockUpdateFavs).toHaveBeenCalledWith({ id: '1', status: false });
  // });

  // it('should show the loading spinner when fetching comics', async () => {
  //   (getComics as jest.Mock).mockImplementation(
  //     () =>
  //       new Promise(resolve => {
  //         setTimeout(() => resolve({ results: [] }), 500);
  //       })
  //   );

  //   render(
  //     <Router>
  //       <CharacterInfo />
  //     </Router>
  //   );

  //   // Check the spinner
  //   expect(screen.getByAltText('Loading')).toBeInTheDocument();
  // });
});
