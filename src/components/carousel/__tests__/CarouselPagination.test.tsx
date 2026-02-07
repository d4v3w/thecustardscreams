import { fireEvent, render, screen } from '@testing-library/react';
import CarouselPagination from '../CarouselPagination';

describe('CarouselPagination', () => {
  const mockOnDotClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correct number of dots', () => {
    render(
      <CarouselPagination
        totalItems={5}
        currentIndex={0}
        onDotClick={mockOnDotClick}
      />
    );

    const dots = screen.getAllByRole('tab');
    expect(dots).toHaveLength(5);
  });

  it('should mark current dot as active', () => {
    render(
      <CarouselPagination
        totalItems={3}
        currentIndex={1}
        onDotClick={mockOnDotClick}
      />
    );

    const dots = screen.getAllByRole('tab');
    expect(dots[1]).toHaveAttribute('aria-current', 'true');
    expect(dots[0]).toHaveAttribute('aria-current', 'false');
    expect(dots[2]).toHaveAttribute('aria-current', 'false');
  });

  it('should have descriptive aria-labels', () => {
    render(
      <CarouselPagination
        totalItems={3}
        currentIndex={0}
        onDotClick={mockOnDotClick}
      />
    );

    expect(screen.getByLabelText('Go to image 1 of 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to image 2 of 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to image 3 of 3')).toBeInTheDocument();
  });

  it('should call onDotClick with correct index', () => {
    render(
      <CarouselPagination
        totalItems={3}
        currentIndex={0}
        onDotClick={mockOnDotClick}
      />
    );

    const dots = screen.getAllByRole('tab');
    
    fireEvent.click(dots[0]!);
    expect(mockOnDotClick).toHaveBeenCalledWith(0);

    fireEvent.click(dots[1]!);
    expect(mockOnDotClick).toHaveBeenCalledWith(1);

    fireEvent.click(dots[2]!);
    expect(mockOnDotClick).toHaveBeenCalledWith(2);
  });

  it('should apply active styling to current dot', () => {
    render(
      <CarouselPagination
        totalItems={3}
        currentIndex={1}
        onDotClick={mockOnDotClick}
      />
    );

    const dots = screen.getAllByRole('tab');
    expect(dots[1]).toHaveClass('bg-amber-400');
    expect(dots[0]).toHaveClass('bg-gray-400');
    expect(dots[2]).toHaveClass('bg-gray-400');
  });
});
