import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import { AuthProvider } from './context/AuthContext';
import { FavProvider } from './context/FavContext.tsx';
import { CharacterProvider } from './context/CharactersContext.tsx';

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
