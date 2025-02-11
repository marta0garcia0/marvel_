import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MenuComponent } from './Menu.component';
import { FavProvider } from '../../context/fav/FavContext';
import { useNavigate } from 'react-router-dom';

jest.mock('./../../constants', () => ({
  ENVIRONMENT: 'test',
  VITE_PUBLIC_KEY: 'publicKey',
  VITE_PRIVATE_KEY: 'privateKey',
  BASE_URL: '/',
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('MenuComponent', () => {
  const mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  it('should render correctly and navigate when clicking on the logo', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <FavProvider>
          <MenuComponent>
            <div>Children</div>
          </MenuComponent>
        </FavProvider>
      </MemoryRouter>
    );

    // verify the logo
    expect(screen.getByAltText('Marvel')).toBeInTheDocument();

    // Simulate click
    fireEvent.click(screen.getByAltText('Marvel'));

    // Verify the route
    expect(window.location.pathname).toBe('/');
  });

  it('should navigate to favorites when clicking on the heart icon', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <FavProvider>
          <MenuComponent>
            <div>Children</div>
          </MenuComponent>
        </FavProvider>
      </MemoryRouter>
    );

    // simulate the click
    fireEvent.click(screen.getByAltText('likes'));

    await waitFor(() => {
      // check route
      expect(mockNavigate).toHaveBeenCalledWith('/favorites', {
        replace: true,
      });
    });
  });
});
