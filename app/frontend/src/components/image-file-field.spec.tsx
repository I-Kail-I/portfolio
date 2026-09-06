import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageFileField } from './image-file-field';

describe('ImageFileField', () => {
  it('renders picker with empty state', () => {
    const { container } = render(<ImageFileField onChange={() => {}} />);
    expect(screen.getByText('Hero image')).toBeInTheDocument();
    expect(screen.getByText('No image selected.')).toBeInTheDocument();
    expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
  });

  it('shows error', () => {
    render(<ImageFileField onChange={() => {}} error='Hero image is required.' />);
    expect(screen.getByText('Hero image is required.')).toBeInTheDocument();
  });

  it('previews valid file and reports it', async () => {
    const user = userEvent.setup();
    const onChange = mock();
    const { container } = render(<ImageFileField onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['img'], 'hero.png', { type: 'image/png' });
    await user.upload(input, file);
    expect(onChange).toHaveBeenCalledWith(file);
    expect(await screen.findByAltText('Selected preview')).toBeInTheDocument();
  });

  it('rejects unsupported type', async () => {
    const user = userEvent.setup();
    const onChange = mock();
    const { container } = render(<ImageFileField onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, new File(['doc'], 'notes.txt', { type: 'text/plain' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
