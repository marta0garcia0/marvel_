import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loader from './../../assets/spinner.svg';
import './Loader.scss';

export const Loader = (props: { url: string }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate(props.url);
    }, 300);
  }, []);
  return (
    <div className="Loader">
      <img src={loader} alt={'Loading'} width={50} height={50} />
    </div>
  );
};
