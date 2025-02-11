import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import md5 from 'md5';

// Mock md5
jest.mock('md5', () => jest.fn(() => 'mockedHash'));

jest.mock('./../../constants', () => ({
  ENVIRONMENT: 'test',
  VITE_PUBLIC_KEY: 'publicKey',
  VITE_PRIVATE_KEY: 'privateKey',
  BASE_URL: '/',
}));

describe('AuthProvider', () => {
  const TestComponent = () => {
    const { hash, ts, error, updateHash } = useAuth();

    return (
      <div>
        <p data-testid="hash">{hash}</p>
        <p data-testid="ts">{ts}</p>
        <p data-testid="error">{error}</p>
        <button onClick={updateHash}>Update Hash</button>
      </div>
    );
  };

  it('should render with default values', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('hash').textContent).toBe('');
    expect(getByTestId('ts').textContent).not.toBe('');
    expect(getByTestId('error').textContent).toBe('');
  });

  it('should update the hash and timestamp when updateHash is called', async () => {
    const { getByTestId, getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      getByText('Update Hash').click();
    });

    expect(md5).toHaveBeenCalledWith(
      expect.stringMatching(/^\d+privateKeypublicKey$/)
    );
    expect(getByTestId('hash').textContent).toBe('mockedHash');
  });

  it('should throw an error if useAuth is used outside of AuthProvider', () => {
    const renderWithoutProvider = () => {
      const TestComponentWithoutProvider = () => {
        useAuth();
        return <div />;
      };
      render(<TestComponentWithoutProvider />);
    };

    expect(renderWithoutProvider).toThrow(
      'useAuth must be used within an AuthProvider'
    );
  });
});
