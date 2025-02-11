import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FavState {
  updateFavs: (props: { id: number; status: boolean }) => void;
  favs: number[];
}

const FavContext = createContext<FavState | undefined>(undefined);

export const FavProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [favs, setFavs] = useState<number[]>([]);

  const updateFavs = (props: { id: number; status: boolean }) => {
    if (props.status) {
      setFavs(favs.concat(props.id));
    } else {
      setFavs(favs.filter(fav => fav !== props.id));
    }
  };

  return (
    <FavContext.Provider value={{ updateFavs, favs }}>
      {children}
    </FavContext.Provider>
  );
};

export const useFav = (): FavState => {
  const context = useContext(FavContext);
  if (!context) {
    throw new Error('useFav must be used within an FavProvider');
  }
  return context;
};
