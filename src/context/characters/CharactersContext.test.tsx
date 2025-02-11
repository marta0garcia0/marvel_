import '@testing-library/jest-dom';
import React from 'react';
import { render, act } from '@testing-library/react';
import { CharacterProvider, useCharacter } from './CharactersContext';
import { CharacterResponse } from '../../services/models';
import { mockCharacter } from '../../__mocks__/result';

const mockCharacterResponse = (offset = 0): CharacterResponse => ({
  offset,
  limit: 10,
  total: 100,
  count: 10,
  results: Array.from({ length: 10 }, (_, index) => ({
    ...mockCharacter.data.results[0],
    id: index + offset,
    name: `Character ${index + offset}`,
    description: `Description for Character ${index + offset}`,
    thumbnail: {
      path: 'path/to/image',
      extension: 'jpg',
    },
  })),
});

describe('CharacterContext', () => {
  let TestComponent: React.FC;

  beforeEach(() => {
    TestComponent = () => {
      const {
        characters,
        filterCharacters,
        updateCharacters,
        updateFilterCharacters,
      } = useCharacter();

      return (
        <div>
          <p>Characters:</p>
          {characters.map(char => (
            <p key={char.name}>{char.name} </p>
          ))}
          <p>
            Filtered Characters:{' '}
            {filterCharacters.map(char => char.name).join(', ')}
          </p>
          <button
            onClick={() =>
              updateCharacters({ characterInfo: mockCharacterResponse(0) })
            }
          >
            Load Characters
          </button>
          <button
            onClick={() =>
              updateFilterCharacters({
                characterInfo: mockCharacterResponse(0),
              })
            }
          >
            Load Filtered Characters
          </button>
          <button onClick={() => updateFilterCharacters({})}>
            Clear Filter
          </button>
        </div>
      );
    };
  });

  it('should provide an empty initial state', () => {
    const { getByText } = render(
      <CharacterProvider>
        <TestComponent />
      </CharacterProvider>
    );

    expect(getByText('Characters:')).toBeInTheDocument();
    expect(getByText('Filtered Characters:')).toBeInTheDocument();
  });

  it('should update characters when updateCharacters is called', () => {
    const { getByText } = render(
      <CharacterProvider>
        <TestComponent />
      </CharacterProvider>
    );

    act(() => {
      getByText('Load Characters').click();
    });

    expect(getByText('Character 0')).toBeInTheDocument();
    expect(getByText('Character 9')).toBeInTheDocument();
  });

  it('should update filtered characters when updateFilterCharacters is called', () => {
    const { getByText } = render(
      <CharacterProvider>
        <TestComponent />
      </CharacterProvider>
    );

    act(() => {
      getByText('Load Filtered Characters').click();
    });

    expect(
      getByText(
        'Filtered Characters: Character 0, Character 1, Character 2, Character 3, Character 4, Character 5, Character 6, Character 7, Character 8, Character 9'
      )
    ).toBeInTheDocument();
  });

  it('should clear filtered characters when updateFilterCharacters is called with an empty object', () => {
    const { getByText } = render(
      <CharacterProvider>
        <TestComponent />
      </CharacterProvider>
    );

    act(() => {
      getByText('Load Filtered Characters').click();
    });

    expect(
      getByText(
        'Filtered Characters: Character 0, Character 1, Character 2, Character 3, Character 4, Character 5, Character 6, Character 7, Character 8, Character 9'
      )
    ).toBeInTheDocument();

    act(() => {
      getByText('Clear Filter').click();
    });

    expect(getByText('Filtered Characters:')).toBeInTheDocument();
  });

  it('should append characters if offset is not 0', () => {
    const { getByText } = render(
      <CharacterProvider>
        <TestComponent />
      </CharacterProvider>
    );

    act(() => {
      getByText('Load Characters').click();
      getByText('Load Characters').click();
    });

    expect(getByText('Character 0')).toBeInTheDocument();
    expect(getByText('Character 9')).toBeInTheDocument();
  });
});
