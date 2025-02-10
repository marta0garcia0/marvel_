import { useState, useEffect } from 'react';
import search from './../../assets/search.svg';
import './Filter.scss';

function FilterComponent(props: { onChange: (text: string) => void }) {
  const [inputValue, setInputValue] = useState('');
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      props.onChange(inputValue);
    }, 1000);

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
}

export default FilterComponent;
