import '@testing-library/jest-dom';
// CardComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CardComponent } from './Card.component';
import { useFav } from '../../context/fav/FavContext';
import heartFull from './../../assets/heart-full.svg';
import heartEmpty from './../../assets/heart-empty.svg';
import { mockCharacter } from '../../__mocks__/result';

jest.mock('../../context/fav/FavContext');

describe('CardComponent', () => {
  const mockUpdateFavs = jest.fn();
  const mockOnClick = jest.fn();

  const character = {
    ...mockCharacter.data.results[0],
    id: 1,
    name: 'Spider-Man',
    thumbnail: { path: 'https://example.com/spiderman', extension: 'jpg' },
  };

  beforeEach(() => {
    (useFav as jest.Mock).mockReturnValue({
      favs: [],
      updateFavs: mockUpdateFavs,
    });
    jest.clearAllMocks();
  });

  test('renders the character image and name', () => {
    render(
      <CardComponent
        key={1}
        k={1}
        character={character}
        onClick={mockOnClick}
      />
    );

    const image = screen.getByRole('img', { name: /like/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', heartEmpty);

    const name = screen.getByText('SPIDER-MAN');
    expect(name).toBeInTheDocument();
  });

  test('calls onClick with the correct character id when the image is clicked', () => {
    render(
      <CardComponent
        key={1}
        k={1}
        character={character}
        onClick={mockOnClick}
      />
    );

    const cardImage = screen.getByAltText('Card cover');
    fireEvent.click(cardImage);

    expect(mockOnClick).toHaveBeenCalledWith('1');
  });

  test('updates the like state and calls updateFavs when the like button is clicked', () => {
    (useFav as jest.Mock).mockReturnValue({
      favs: ['1'],
      updateFavs: mockUpdateFavs,
    });

    render(
      <CardComponent
        key={1}
        k={1}
        character={character}
        onClick={mockOnClick}
      />
    );

    const likeButton = screen.getByRole('img', { name: /like/i });
    expect(likeButton).toHaveAttribute('src', heartFull);

    fireEvent.click(likeButton);

    expect(mockUpdateFavs).toHaveBeenCalledWith({ id: 1, status: false });
  });

  test('initially sets the liked state to true if the character is in favs', () => {
    (useFav as jest.Mock).mockReturnValue({
      favs: ['1'],
      updateFavs: mockUpdateFavs,
    });

    render(
      <CardComponent
        key={1}
        k={1}
        character={character}
        onClick={mockOnClick}
      />
    );

    const likeButton = screen.getByRole('img', { name: /like/i });
    expect(likeButton).toHaveAttribute('src', heartFull);
  });
});
