import { useEffect } from 'react';
import heartFull from './../../assets/heart-full.svg';
import heartEmpty from './../../assets/heart-empty.svg';
import './Heart.scss';

export const HeartComponent = (props: {
  likes: number;
  onClick: () => void;
}) => {
  useEffect(() => {}, []);
  return (
    <div className="Heart">
      <img
        onClick={props.onClick}
        src={!props.likes ? heartEmpty : heartFull}
        alt={'likes'}
        width={24}
      />
      <span className="Heart-text">{props.likes}</span>
    </div>
  );
};
