import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Character,
  CharacterMetadataResponse,
  CharacterResponse,
} from '../../services/models';

interface CharacterState {
  updateFilterCharacters: (props: {
    characterInfo?: CharacterResponse;
  }) => void;
  updateCharacters: (props: { characterInfo: CharacterResponse }) => void;
  characters: Character[];
  characterInfo?: CharacterMetadataResponse;
  filterCharacters: Character[];
  filterCharacterInfo?: CharacterMetadataResponse;
}

const CharacterContext = createContext<CharacterState | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [characterInfo, setCharacterInfo] =
    useState<CharacterMetadataResponse>();
  const [filterCharacters, setFilterCharacters] = useState<Character[]>([]);
  const [filterCharacterInfo, setFilterCharacterInfo] =
    useState<CharacterMetadataResponse>();

  const updateCharacters = (props: { characterInfo: CharacterResponse }) => {
    if (props.characterInfo.offset === 0) {
      // if page 0 reset the list
      setCharacters(props.characterInfo.results);
    } else {
      setCharacters(
        characters
          .slice(0, props.characterInfo.offset)
          .concat(props.characterInfo.results)
      );
    }
    setCharacterInfo({
      offset: props.characterInfo.offset,
      limit: props.characterInfo.limit,
      total: props.characterInfo.total,
      count: props.characterInfo.count,
    });
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
          filterCharacters
            .slice(0, props.characterInfo.offset)
            .concat(props.characterInfo.results)
        );
      }
      setFilterCharacterInfo({
        offset: props.characterInfo.offset,
        limit: props.characterInfo.limit,
        total: props.characterInfo.total,
        count: props.characterInfo.count,
      });
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
