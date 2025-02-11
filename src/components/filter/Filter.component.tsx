import { useState, useEffect } from 'react';
import search from './../../assets/search.svg';
import './Filter.scss';
import { FILTER_TIME } from '../../constants';

export const FilterComponent = (props: {
  onChange: (text: string) => void;
}) => {
  const [inputValue, setInputValue] = useState('');
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      props.onChange(inputValue);
    }, FILTER_TIME);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue]);

  return (
    <div className="Filter">
      <img src={search} alt="search" width={14} />
      <input
        placeholder="SEARCH A CHARACTER..."
        onChange={e => {
          setInputValue(e.target.value);
        }}
      />
    </div>
  );
};
