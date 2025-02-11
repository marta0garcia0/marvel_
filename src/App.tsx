import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CharacterInfo from './pages/character-info/CharacterInfo.page';
import CharacterList from './pages/character-list/CharacterList.page';
import FavListPage from './pages/fav-list/FavList.page';
import { MenuComponent } from './components/menu/Menu.component';
import { LoaderComponent } from './components/loader/Loader.component';
import { useAuth } from './context/auth/AuthContext';

import { BASE_URL } from './constants';
import './App.scss';

function App() {
  const { updateHash } = useAuth();
  useEffect(() => {
    updateHash();
  }, []);

  return (
    <div className="App">
      <Router>
        <MenuComponent>
          <Routes>
            <Route
              path={`${BASE_URL}`}
              element={<LoaderComponent url={`${BASE_URL}characters`} />}
            />
            <Route path={`${BASE_URL}characters`} element={<CharacterList />} />
            <Route
              path={`${BASE_URL}characters/:id`}
              element={<CharacterInfo />}
            />
            <Route path={`${BASE_URL}favorites`} element={<FavListPage />} />
          </Routes>
        </MenuComponent>
      </Router>
    </div>
  );
}

export default App;
