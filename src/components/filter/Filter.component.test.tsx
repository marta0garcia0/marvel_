import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FilterComponent } from './Filter.component';

jest.mock('./../../constants', () => ({
  ENVIRONMENT: 'test',
  VITE_PUBLIC_KEY: 'mockedApiKey',
  BASE_URL: '/',
}));

describe('FilterComponent', () => {
  test('renders the search icon and input field', () => {
    render(<FilterComponent onChange={jest.fn()} />);

    const searchIcon = screen.getByAltText('search');
    expect(searchIcon).toBeInTheDocument();
    expect(searchIcon).toHaveAttribute(
      'src',
      expect.stringContaining('test-file-stub')
    );

    const inputField = screen.getByPlaceholderText('SEARCH A CHARACTER...');
    expect(inputField).toBeInTheDocument();
  });

  test('calls onChange with the correct value after 1-second debounce', async () => {
    const mockOnChange = jest.fn();
    render(<FilterComponent onChange={mockOnChange} />);

    const inputField = screen.getByPlaceholderText('SEARCH A CHARACTER...');

    // Simulate typing
    fireEvent.change(inputField, { target: { value: 'Spider' } });
    fireEvent.change(inputField, { target: { value: 'Spider-Man' } });

    // Wait for the debounce (1 second)
    await waitFor(
      () => {
        expect(mockOnChange).toHaveBeenCalledWith('Spider-Man');
      },
      { timeout: 1500 }
    );
  });

  test('clears previous timeout on new input change', async () => {
    const mockOnChange = jest.fn();
    render(<FilterComponent onChange={mockOnChange} />);

    const inputField = screen.getByPlaceholderText('SEARCH A CHARACTER...');

    fireEvent.change(inputField, { target: { value: 'A' } });
    fireEvent.change(inputField, { target: { value: 'AB' } });
    fireEvent.change(inputField, { target: { value: 'ABC' } });

    // Wait for the debounce to finish
    await waitFor(
      () => {
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith('ABC');
      },
      { timeout: 1500 }
    );
  });
});
