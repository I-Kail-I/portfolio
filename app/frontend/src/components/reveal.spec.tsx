import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { Reveal } from './reveal';

describe('Reveal', () => {
  it('renders children', () => {
    render(<Reveal>hello</Reveal>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<Reveal className='custom'>hi</Reveal>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('accepts delay and once props', () => {
    render(
      <Reveal delay={0.5} once={false}>
        delayed
      </Reveal>,
    );
    expect(screen.getByText('delayed')).toBeInTheDocument();
  });
});
