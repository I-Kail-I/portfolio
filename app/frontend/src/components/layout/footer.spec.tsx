import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';

mock.module('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={typeof href === 'string' ? href : '#'} {...props}>
      {children}
    </a>
  ),
}));

import { Footer } from './footer';

describe('Footer', () => {
  it('renders headline and brand', () => {
    render(<Footer />);
    expect(screen.getByText(/Not sure what your product needs/i)).toBeInTheDocument();
    expect(screen.getByText('Mikail Arianos')).toBeInTheDocument();
  });

  it('links email, whatsapp and linkedin', () => {
    render(<Footer />);
    expect(screen.getByText('arianosmikail5@gmail.com')).toBeInTheDocument();
    expect(document.querySelector('a[href^="mailto:"]')).toBeInTheDocument();
    expect(document.querySelector('a[href*="wa.me"]')).toBeInTheDocument();
    expect(document.querySelector('a[href*="linkedin.com"]')).toBeInTheDocument();
  });

  it('shows current year copyright', () => {
    render(<Footer />);
    expect(
      screen.getByText(new RegExp(`${new Date().getFullYear()} Mikail Arianos`)),
    ).toBeInTheDocument();
  });
});

void mock;
