import { useState, useEffect } from 'react';
import { getCharacters } from '../../services/api';
import {
  Character,
  CharacterMetadataResponse,
  CharacterResponse,
} from '../../services/models';
import { useAuth } from '../../context/auth/AuthContext';
import { CardComponent } from '../../components/card/Card.component';
import { useNavigate } from 'react-router-dom';
import { FilterComponent } from '../../components/filter/Filter.component';
import { useCharacter } from '../../context/characters/CharactersContext';
import loader from './../../assets/spinner.svg';
import './CharacterList.scss';
import { PAGE_SIZE } from '../../constants';

function CharacterList() {
  // text to filter items
  const [filter, setFilter] = useState<string>();
  // page for filter search
  const [filterPage, setFilterPage] = useState<number>(0);
  // page without filter
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  // items to display
  const [items, setItems] = useState<Character[]>([]);
  // metadata like limit, total, etc
  const [itemsInfo, setItemsInfo] = useState<CharacterMetadataResponse>();
  const navigate = useNavigate();
  const { ts, hash } = useAuth();
  const {
    characters,
    characterInfo,
    updateCharacters,
    updateFilterCharacters,
    filterCharacters,
    filterCharacterInfo,
  } = useCharacter();

  // when data from context is updated change the displayed items
  useEffect(() => {
    setItems(filter ? filterCharacters : characters);
    setItemsInfo(filter ? filterCharacterInfo : characterInfo);
  }, [
    filter,
    characterInfo,
    characters,
    filterCharacterInfo,
    filterCharacters,
  ]);

  useEffect(() => {
    if (filter) {
      // if filter fetch data
      fetchCharacters();
    } else {
      // instead of fetching data, get from context
      setItems(characters);
      setItemsInfo(characterInfo);
    }
  }, [filter, filterPage]);

  useEffect(() => {
    if (!filter && ts && hash) {
      fetchCharacters();
    }
  }, [page, ts, hash]);

  const fetchCharacters = () => {
    if (ts && hash && !loading) {
      setLoading(true);
      getCharacters(ts, hash, filter, (filter ? filterPage : page) * PAGE_SIZE)
        .then((data: CharacterResponse) => {
          if (filter) {
            updateFilterCharacters({ characterInfo: data });
          } else {
            updateCharacters({ characterInfo: data });
            updateFilterCharacters({});
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="CharacterList">
      <FilterComponent
        onChange={text => {
          setFilter(text);
          if (text) {
            setFilterPage(0);
          }
        }}
      />
      <p className="CharacterList-filter">
        {itemsInfo ? `${itemsInfo?.total} RESULTS` : ''}
      </p>
      {itemsInfo && itemsInfo ? (
        <>
          <div className="CharacterList-cards">
            {items.map(character => {
              return (
                <CardComponent
                  key={character.id}
                  k={character.id}
                  character={character}
                  onClick={(id: string) => navigate(`${id}`)}
                />
              );
            })}
          </div>
          {!loading && itemsInfo && items.length < itemsInfo.total ? (
            <div className="CharacterList-more">
              <button
                onClick={() => {
                  if (filter) {
                    setFilterPage(filterPage + 1);
                  } else {
                    setPage(page + 1);
                  }
                }}
                className="CharacterList-more__button"
              >
                more
              </button>
            </div>
          ) : null}
        </>
      ) : null}
      {loading ? (
        <div className="CharacterList-loading">
          <img src={loader} alt={'Loading'} width={50} height={50} />
        </div>
      ) : null}
    </div>
  );
}

export default CharacterList;
