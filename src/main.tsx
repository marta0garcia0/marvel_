import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import { AuthProvider } from './context/auth/AuthContext.tsx';
import { FavProvider } from './context/fav/FavContext.tsx';
import { CharacterProvider } from './context/characters/CharactersContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <FavProvider>
        <CharacterProvider>
          <App />
        </CharacterProvider>
      </FavProvider>
    </AuthProvider>
  </React.StrictMode>
);
