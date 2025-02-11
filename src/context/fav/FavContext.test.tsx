import '@testing-library/jest-dom';
import React from 'react';
import { render, act } from '@testing-library/react';
import { FavProvider, useFav } from './FavContext';

describe('FavContext', () => {
  let TestComponent: React.FC;

  beforeEach(() => {
    TestComponent = () => {
      const { favs, updateFavs } = useFav();

      return (
        <div>
          <p>Favorites: {favs.join(', ')}</p>
          <button onClick={() => updateFavs({ id: 1, status: true })}>
            Add 1
          </button>
          <button onClick={() => updateFavs({ id: 1, status: false })}>
            Remove 1
          </button>
        </div>
      );
    };
  });

  it('should provide an empty initial state', () => {
    const { getByText } = render(
      <FavProvider>
        <TestComponent />
      </FavProvider>
    );

    expect(getByText('Favorites:')).toBeInTheDocument();
  });

  it('should add a favorite when updateFavs is called with status true', () => {
    const { getByText } = render(
      <FavProvider>
        <TestComponent />
      </FavProvider>
    );

    act(() => {
      getByText('Add 1').click();
    });

    expect(getByText('Favorites: 1')).toBeInTheDocument();
  });

  it('should remove a favorite when updateFavs is called with status false', () => {
    const { getByText } = render(
      <FavProvider>
        <TestComponent />
      </FavProvider>
    );

    act(() => {
      getByText('Add 1').click();
    });

    act(() => {
      getByText('Remove 1').click();
    });

    expect(getByText('Favorites:')).toBeInTheDocument();
  });

  it('should not add a duplicate favorite', () => {
    const { getByText } = render(
      <FavProvider>
        <TestComponent />
      </FavProvider>
    );

    act(() => {
      getByText('Add 1').click();
      getByText('Add 1').click();
    });

    expect(getByText('Favorites: 1')).toBeInTheDocument();
  });
});
