import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { TextBlock } from './text-block';

describe('TextBlock', () => {
  it('renders title and description', () => {
    render(
      <TextBlock
        text={{ title: 'T', description: 'D' }}
        index={0}
        onActive={mock(() => {})}
      />,
    );
    expect(screen.getByRole('heading')).toHaveTextContent('T');
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('renders different text per index', () => {
    render(
      <TextBlock
        text={{ title: 'Second', description: 'Desc two' }}
        index={1}
        onActive={mock(() => {})}
      />,
    );
    expect(screen.getByRole('heading')).toHaveTextContent('Second');
    expect(screen.getByText('Desc two')).toBeInTheDocument();
  });
});
