import { describe, expect, it } from 'bun:test';
import { render } from '@testing-library/react';
import { Separator } from './separator';

describe('Separator', () => {
  it('renders with slot', () => {
    const { container } = render(<Separator />);
    expect(container.querySelector('[data-slot="separator"]')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<Separator className='custom-class' />);
    expect(container.querySelector('[data-slot="separator"]')).toHaveClass('custom-class');
  });
});
