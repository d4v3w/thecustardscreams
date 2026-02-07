import { fireEvent, render, screen } from '@testing-library/react';
import CarouselNavigation from '../CarouselNavigation';

describe('CarouselNavigation', () => {
  const mockOnPrevious = jest.fn();
  const mockOnNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render both navigation buttons', () => {
    render(
      <CarouselNavigation
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        canScrollPrevious={true}
        canScrollNext={true}
      />
    );

    expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
    expect(screen.getByLabelText('Next image')).toBeInTheDocument();
  });

  it('should call onPrevious when previous button is clicked', () => {
    render(
      <CarouselNavigation
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        canScrollPrevious={true}
        canScrollNext={true}
      />
    );

    fireEvent.click(screen.getByLabelText('Previous image'));
    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it('should call onNext when next button is clicked', () => {
    render(
      <CarouselNavigation
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        canScrollPrevious={true}
        canScrollNext={true}
      />
    );

    fireEvent.click(screen.getByLabelText('Next image'));
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('should disable previous button when canScrollPrevious is false', () => {
    render(
      <CarouselNavigation
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        canScrollPrevious={false}
        canScrollNext={true}
      />
    );

    const prevButton = screen.getByLabelText('Previous image');
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button when canScrollNext is false', () => {
    render(
      <CarouselNavigation
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        canScrollPrevious={true}
        canScrollNext={false}
      />
    );

    const nextButton = screen.getByLabelText('Next image');
    expect(nextButton).toBeDisabled();
  });

  it('should have minimum touch target size', () => {
    render(
      <CarouselNavigation
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        canScrollPrevious={true}
        canScrollNext={true}
      />
    );

    const prevButton = screen.getByLabelText('Previous image');
    const nextButton = screen.getByLabelText('Next image');

    expect(prevButton).toHaveClass('min-w-[44px]', 'min-h-[44px]');
    expect(nextButton).toHaveClass('min-w-[44px]', 'min-h-[44px]');
  });
});
