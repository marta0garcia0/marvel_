import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeartComponent } from './Heart.component';

describe('Heart component', () => {
  test('renders the heart-empty image when likes is 0', () => {
    render(<HeartComponent likes={0} onClick={jest.fn()} />);

    const heartImg = screen.getByAltText('likes');
    expect(heartImg).toBeInTheDocument();
    expect(heartImg).toHaveAttribute(
      'src',
      expect.stringContaining('test-file-stub')
    );
  });

  test('renders the heart-full image when likes is greater than 0', () => {
    render(<HeartComponent likes={5} onClick={jest.fn()} />);

    const heartImg = screen.getByAltText('likes');
    expect(heartImg).toBeInTheDocument();
    expect(heartImg).toHaveAttribute(
      'src',
      expect.stringContaining('test-file-stub')
    );
  });

  test('calls the onClick handler when the heart image is clicked', () => {
    const handleClick = jest.fn();
    render(<HeartComponent likes={3} onClick={handleClick} />);

    const heartImg = screen.getByAltText('likes');
    fireEvent.click(heartImg);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('displays the correct number of likes', () => {
    render(<HeartComponent likes={10} onClick={jest.fn()} />);

    const likeText = screen.getByText('10');
    expect(likeText).toBeInTheDocument();
  });
});
