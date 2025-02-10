import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Character, CharacterResponse } from '../services/models';

interface CharacterState {
  updateFilterCharacters: (props: {
    characterInfo?: CharacterResponse;
  }) => void;
  updateCharacters: (props: { characterInfo: CharacterResponse }) => void;
  characters: Character[];
  characterInfo?: CharacterResponse;
  filterCharacters: Character[];
  filterCharacterInfo?: CharacterResponse;
}

const CharacterContext = createContext<CharacterState | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [characterInfo, setCharacterInfo] = useState<CharacterResponse>();
  const [filterCharacters, setFilterCharacters] = useState<Character[]>([]);
  const [filterCharacterInfo, setFilterCharacterInfo] =
    useState<CharacterResponse>();

  const updateCharacters = (props: { characterInfo: CharacterResponse }) => {
    if (props.characterInfo.offset === 0) {
      setCharacters(props.characterInfo.results);
    } else {
      setCharacters(
        characters
          .slice(0, props.characterInfo.offset)
          .concat(props.characterInfo.results)
      );
    }
    setCharacterInfo(props.characterInfo);
  };

  const updateFilterCharacters = (props: {
    characterInfo?: CharacterResponse;
  }) => {
    if (!props.characterInfo) {
      setFilterCharacterInfo(undefined);
      setFilterCharacters([]);
    } else {
      if (props.characterInfo.offset === 0) {
        setFilterCharacters(props.characterInfo.results);
      } else {
        setFilterCharacters(
          characters
            .slice(0, props.characterInfo.offset)
            .concat(props.characterInfo.results)
        );
      }
      setFilterCharacterInfo(props.characterInfo);
    }
  };

  return (
    <CharacterContext.Provider
      value={{
        updateCharacters,
        updateFilterCharacters,
        filterCharacters,
        filterCharacterInfo,
        characterInfo,
        characters,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = (): CharacterState => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within an CharacterProvider');
  }
  return context;
};
