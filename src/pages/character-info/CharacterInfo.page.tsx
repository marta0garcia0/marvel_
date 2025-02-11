import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';
import { getCharacter, getComics } from '../../services/api';
import { useEffect, useState } from 'react';
import {
  Character,
  CharacterResponse,
  ComicResponse,
} from '../../services/models';
import { useFav } from '../../context/fav/FavContext';
import heartFull from './../../assets/heart-full.svg';
import heartEmpty from './../../assets/heart-empty.svg';
import loader from './../../assets/spinner.svg';
import './CharacterInfo.scss';

function CharacterInfo() {
  const [character, setCharacter] = useState<Character>();
  const [comics, setComics] = useState<ComicResponse>();
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams();

  const { ts, hash } = useAuth();
  const { favs, updateFavs } = useFav();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(!!favs.find(fav => fav + '' === id));
  }, [favs]);

  const onLike = () => {
    if (character) {
      updateFavs({ id: character.id, status: !liked });
    }
  };

  useEffect(() => {
    if (ts && hash && id && !loading) {
      setLoading(true);
      getCharacter(ts, hash, id)
        .then((data: CharacterResponse) => {
          setCharacter(data.results[0]);
          if (ts && hash) {
            setLoading(true);

            getComics(ts, hash, data.results[0].comics.collectionURI)
              .then((data: ComicResponse) => {
                setComics(data);
              })
              .finally(() => {
                setLoading(false);
              });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, ts, hash]);

  return !loading ? (
    <div className="CharacterInfo">
      {character ? (
        <div className="Character-header">
          <div className="Character-header__container">
            <div className="Character-header__picture">
              <img
                className="Character-header__cover"
                src={
                  character.thumbnail.path + '.' + character.thumbnail.extension
                }
              />
            </div>
            <div className="Character-header__wrapper">
              <div>
                <div className="Character-header__title">
                  <div className="Character-header__text">
                    <span>{character.name}</span>
                  </div>
                  <div className="Character-header__icon">
                    <img
                      onClick={onLike}
                      className="Card-heart"
                      src={liked ? heartFull : heartEmpty}
                      alt={'like'}
                    />
                  </div>
                </div>
              </div>
              <div className="Character-header__description">
                <span>{character.description}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {comics ? (
        <div className="Character-body__container">
          <div className="Character-body">
            <div className="Character-body__title">
              <p>COMICS</p>
            </div>
            <div className="Character-body__list">
              {comics.results.map(comic => {
                return (
                  <div key={comic.id} className="Character-body__comic">
                    <div>
                      <img
                        className="Character-comic__cover"
                        src={
                          comic.thumbnail.path + '.' + comic.thumbnail.extension
                        }
                        alt={'comic-like'}
                      />
                    </div>
                    <div className="Character-comic__legend">
                      <p className="Character-comic__legend-title">
                        {comic.title}
                      </p>
                      <p className="Character-comic__legend-date">
                        {new Date(comic.modified).getFullYear()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="CharacterList-loading">
          <img src={loader} alt={'Loading'} width={50} height={50} />
        </div>
      )}
    </div>
  ) : (
    <div className="CharacterList-loading">
      <img src={loader} alt={'Loading'} width={50} height={50} />
    </div>
  );
}

export default CharacterInfo;
