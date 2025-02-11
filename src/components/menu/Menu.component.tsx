import { ReactNode } from 'react';
import { useFav } from '../../context/fav/FavContext';
import { useNavigate } from 'react-router-dom';
import logo from './../../assets/marvel-logo.svg';
import { HeartComponent } from '../heart/Heart.component';
import { BASE_URL } from '../../constants';
import './Menu.scss';

export const MenuComponent: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { favs } = useFav();
  return (
    <div className="Menu">
      <div className="Menu-wrapper">
        <img
          onClick={() => navigate(BASE_URL, { replace: true })}
          className="Logo"
          src={logo}
          alt={'Marvel'}
          height={52}
        />
        <div className="Likes-container">
          <HeartComponent
            likes={favs.length}
            onClick={() => {
              navigate(`${BASE_URL}favorites`, { replace: true });
            }}
          />
        </div>
      </div>
      {children}
    </div>
  );
};
