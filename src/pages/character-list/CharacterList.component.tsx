import { useState, useEffect } from 'react';
import { getCharacters } from '../../services/api';
import { Character, CharacterResponse } from '../../services/models';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/card/Card';
import { useNavigate } from 'react-router-dom';
import FilterComponent from '../../components/filter/Filter.component';
import loader from './../../assets/spinner.svg';
import { useCharacter } from '../../context/CharactersContext';
import './CharacterList.scss';

function CharacterList() {
  const [filter, setFilter] = useState<string>();
  const [page, setPage] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Character[]>([]);
  const [itemsInfo, setItemsInfo] = useState<CharacterResponse>();
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

  useEffect(() => {
    setPage(0);
  }, [ts, hash]);

  const loadMore = () => {
    setPage((page || 0) + 1);
  };

  useEffect(() => {
    if (filter) {
      setItems(filterCharacters);
      setItemsInfo(filterCharacterInfo);
    } else {
      setItems(characters);
      setItemsInfo(characterInfo);
    }
  }, [
    filter,
    characterInfo,
    characters,
    filterCharacterInfo,
    filterCharacters,
  ]);

  useEffect(() => {
    if (ts && hash && !loading) {
      setLoading(true);
      getCharacters(ts, hash, filter, (page || 0) * 20)
        .then((data: CharacterResponse) => {
          if (filter) {
            updateFilterCharacters({ characterInfo: data });
          } else {
            updateCharacters({ characterInfo: data });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [page]);

  useEffect(() => {
    if (filter && filter.length > 0) {
      if (ts && hash && !loading) {
        setLoading(true);
        getCharacters(ts, hash, filter, (page || 0) * 20)
          .then((data: CharacterResponse) => {
            updateFilterCharacters({ characterInfo: data });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      updateFilterCharacters({});
    }
  }, [filter]);

  return (
    <div className="CharacterList">
      <FilterComponent
        onChange={text => {
          setFilter(text);
          setPage(0);
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
                <Card
                  key={character.id}
                  character={character}
                  onClick={(id: string) => navigate(`${id}`)}
                />
              );
            })}
          </div>
          {!loading && itemsInfo && itemsInfo.count < itemsInfo.total ? (
            <div className="CharacterList-more">
              <button onClick={loadMore} className="CharacterList-more__button">
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
