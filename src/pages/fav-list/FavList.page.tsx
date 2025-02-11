import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Character } from '../../services/models';
import { useFav } from '../../context/fav/FavContext';
import { CardComponent } from '../../components/card/Card.component';
import { FilterComponent } from '../../components/filter/Filter.component';
import { useCharacter } from '../../context/characters/CharactersContext';
import { BASE_URL } from '../../constants';
import './FavList.scss';

function FavListPage() {
  const [favList, setFavList] = useState<Character[]>([]);
  const [filter, setFilter] = useState<string>();
  const { characters } = useCharacter();
  const navigate = useNavigate();
  const { favs } = useFav();

  useEffect(() => {
    setFavList(characters.filter(char => favs.includes(char.id)));
  }, [favs]);

  return (
    <div className="FavList">
      <div className="FavList-body__title">
        <p>FAVORITES</p>
      </div>
      <FilterComponent
        onChange={text => {
          setFilter(text);
        }}
      />
      <p className="FavList-filter">{`${
        favList.filter(
          fav =>
            !filter ||
            fav.name.toLowerCase().includes(filter.toLocaleLowerCase())
        ).length
      } RESULTS`}</p>
      <div className="FavList-cards">
        {favList
          .filter(
            fav =>
              !filter ||
              fav.name.toLowerCase().includes(filter.toLocaleLowerCase())
          )
          .map(char => {
            return (
              <CardComponent
                k={char.id}
                key={char.id}
                character={char}
                onClick={(id: string) =>
                  navigate(`${BASE_URL}characters/${id}`, { replace: true })
                }
              />
            );
          })}
      </div>
    </div>
  );
}

export default FavListPage;
