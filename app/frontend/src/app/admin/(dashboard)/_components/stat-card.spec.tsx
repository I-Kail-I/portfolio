import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label='Total works' value={7} isLoading={false} />);
    expect(screen.getByText('Total works')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('renders dash while loading', () => {
    render(<StatCard label='Total works' value={7} isLoading />);
    expect(screen.getByText('–')).toBeInTheDocument();
  });
});
