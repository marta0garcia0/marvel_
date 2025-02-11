import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { LoaderComponent } from './Loader.component';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // keeps other functionality
  useNavigate: jest.fn(), // mock only useNavigate
}));

describe('Loader component', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn(); // Create a new mock for useNavigate
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to avoid interference
  });

  test('renders the loading spinner', () => {
    render(<LoaderComponent url="/test" />);

    const spinner = screen.getByAltText('Loading');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute(
      'src',
      expect.stringContaining('test-file-stub')
    );
  });

  test('navigates to the provided URL after 300ms', async () => {
    render(<LoaderComponent url="/test" />);

    // Wait for 300ms and verify that navigate is called
    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/test');
      },
      { timeout: 500 }
    ); // Use a timeout slightly longer than 300ms to be safe
  });
});
