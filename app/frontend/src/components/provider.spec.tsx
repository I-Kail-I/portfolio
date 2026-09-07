import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { Providers } from './provider';

describe('Providers', () => {
  it('renders children', () => {
    render(
      <Providers>
        <span>child</span>
      </Providers>,
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <Providers>
        <span>one</span>
        <span>two</span>
      </Providers>,
    );
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('two')).toBeInTheDocument();
  });
});
