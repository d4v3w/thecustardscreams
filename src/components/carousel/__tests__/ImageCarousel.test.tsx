import { render, screen } from '@testing-library/react';
import ImageCarousel from '../ImageCarousel';
import type { CarouselImage } from '../types';

describe('ImageCarousel', () => {
  const mockImages: CarouselImage[] = [
    {
      src: 'https://example.com/image1.jpg',
      alt: 'Image 1',
      id: 'img-1',
    },
    {
      src: 'https://example.com/image2.jpg',
      alt: 'Image 2',
      id: 'img-2',
    },
    {
      src: 'https://example.com/image3.jpg',
      alt: 'Image 3',
      id: 'img-3',
    },
  ];

  it('should render all images', () => {
    render(<ImageCarousel images={mockImages} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
    expect(images[0]).toHaveAttribute('alt', 'Image 1');
    expect(images[1]).toHaveAttribute('alt', 'Image 2');
    expect(images[2]).toHaveAttribute('alt', 'Image 3');
  });

  it('should preserve image src and alt attributes', () => {
    render(<ImageCarousel images={mockImages} />);

    mockImages.forEach((image) => {
      const imgElement = screen.getByAltText(image.alt);
      expect(imgElement).toHaveAttribute('src', image.src);
      expect(imgElement).toHaveAttribute('alt', image.alt);
    });
  });

  it('should render navigation buttons when multiple images', () => {
    render(<ImageCarousel images={mockImages} />);

    expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
    expect(screen.getByLabelText('Next image')).toBeInTheDocument();
  });

  it('should render pagination dots matching image count', () => {
    render(<ImageCarousel images={mockImages} />);

    const dots = screen.getAllByRole('tab');
    expect(dots).toHaveLength(3);
  });

  it('should hide navigation for single image', () => {
    const singleImage = [mockImages[0]!];
    render(<ImageCarousel images={singleImage} />);

    expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('should render empty state for empty array', () => {
    render(<ImageCarousel images={[]} />);

    expect(screen.getByText('No images to display')).toBeInTheDocument();
  });

  it('should have proper ARIA labels', () => {
    render(<ImageCarousel images={mockImages} ariaLabel="Test gallery" />);

    expect(screen.getByRole('region', { name: 'Test gallery' })).toBeInTheDocument();
    expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
    expect(screen.getByLabelText('Next image')).toBeInTheDocument();
  });

  it('should have clickable images with proper accessibility', () => {
    render(<ImageCarousel images={mockImages} />);

    mockImages.forEach((image) => {
      const button = screen.getByLabelText(`View full size: ${image.alt}`);
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });

  it('should apply proper sizing constraints to images', () => {
    render(<ImageCarousel images={mockImages} />);

    const images = screen.getAllByRole('img');
    images.forEach((img) => {
      expect(img).toHaveClass('h-full');
      expect(img).toHaveClass('w-full');
      expect(img).toHaveClass('object-contain');
    });
  });

  it('should apply viewport height constraints to carousel wrapper', () => {
    render(<ImageCarousel images={mockImages} />);

    const carousel = screen.getByRole('region');
    expect(carousel).toHaveClass('max-h-[65vh]');
    expect(carousel).toHaveClass('flex-col');
  });
});
