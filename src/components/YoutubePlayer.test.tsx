import { render, screen } from '@testing-library/react';
import YoutubePlayer from './YoutubePlayer';

describe('YoutubePlayer', () => {
  it('should render iframe with correct video ID', () => {
    render(
      <YoutubePlayer
        videoId="OzE7EgHfAx8"
        title="The Custard Screams - Would You [Official Performance Video]"
      />
    );

    const iframe = screen.getByTitle(
      'The Custard Screams - Would You [Official Performance Video]'
    ) as HTMLIFrameElement;
    expect(iframe).toBeInTheDocument();
    expect(iframe.src).toContain('OzE7EgHfAx8');
  });

  it('should render iframe with youtube.com domain', () => {
    render(
      <YoutubePlayer
        videoId="OzE7EgHfAx8"
        title="The Custard Screams - Would You [Official Performance Video]"
      />
    );

    const iframe = screen.getByTitle(
      'The Custard Screams - Would You [Official Performance Video]'
    ) as HTMLIFrameElement;
    expect(iframe.src).toContain('youtube.com/embed');
  });

  it('should have correct title attribute', () => {
    render(
      <YoutubePlayer
        videoId="OzE7EgHfAx8"
        title="The Custard Screams - Would You [Official Performance Video]"
      />
    );

    const iframe = screen.getByTitle(
      'The Custard Screams - Would You [Official Performance Video]'
    );
    expect(iframe).toBeInTheDocument();
  });

  it('should have allow attribute with required permissions', () => {
    render(
      <YoutubePlayer
        videoId="OzE7EgHfAx8"
        title="The Custard Screams - Would You [Official Performance Video]"
      />
    );

    const iframe = screen.getByTitle(
      'The Custard Screams - Would You [Official Performance Video]'
    ) as HTMLIFrameElement;
    expect(iframe.getAttribute('allow')).toContain('accelerometer');
    expect(iframe.getAttribute('allow')).toContain('autoplay');
    expect(iframe.getAttribute('allow')).toContain('clipboard-write');
    expect(iframe.getAttribute('allow')).toContain('encrypted-media');
    expect(iframe.getAttribute('allow')).toContain('gyroscope');
    expect(iframe.getAttribute('allow')).toContain('picture-in-picture');
    expect(iframe.getAttribute('allow')).toContain('web-share');
  });

  it('should have allowFullScreen attribute', () => {
    render(
      <YoutubePlayer
        videoId="OzE7EgHfAx8"
        title="The Custard Screams - Would You [Official Performance Video]"
      />
    );

    const iframe = screen.getByTitle(
      'The Custard Screams - Would You [Official Performance Video]'
    ) as HTMLIFrameElement;
    expect(iframe).toHaveAttribute('allowfullscreen');
  });

  it('should have rounded-lg class for styling', () => {
    render(
      <YoutubePlayer
        videoId="OzE7EgHfAx8"
        title="The Custard Screams - Would You [Official Performance Video]"
      />
    );

    const iframe = screen.getByTitle(
      'The Custard Screams - Would You [Official Performance Video]'
    ) as HTMLIFrameElement;
    expect(iframe).toHaveClass('rounded-lg');
  });

  it('should accept className prop', () => {
    const { container } = render(
      <YoutubePlayer
        videoId="OzE7EgHfAx8"
        title="The Custard Screams - Would You [Official Performance Video]"
        className="mb-6"
      />
    );

    const wrapper = container.querySelector('.mb-6');
    expect(wrapper).toBeInTheDocument();
  });

  it('should render with correct width and height', () => {
    render(
      <YoutubePlayer
        videoId="OzE7EgHfAx8"
        title="The Custard Screams - Would You [Official Performance Video]"
      />
    );

    const iframe = screen.getByTitle(
      'The Custard Screams - Would You [Official Performance Video]'
    ) as HTMLIFrameElement;
    expect(iframe).toHaveAttribute('width', '560');
    expect(iframe).toHaveAttribute('height', '315');
  });

  it('should have frameBorder="0"', () => {
    render(
      <YoutubePlayer
        videoId="OzE7EgHfAx8"
        title="The Custard Screams - Would You [Official Performance Video]"
      />
    );

    const iframe = screen.getByTitle(
      'The Custard Screams - Would You [Official Performance Video]'
    ) as HTMLIFrameElement;
    expect(iframe).toHaveAttribute('frameborder', '0');
  });
});
