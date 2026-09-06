import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReadmeEditor } from './readme-editor';

describe('ReadmeEditor', () => {
  it('renders editor value and live preview side by side', async () => {
    const onChange = mock();
    const { container } = render(<ReadmeEditor value='# Hi' onChange={onChange} />);
    expect(screen.getByLabelText('Markdown editor')).toHaveValue('# Hi');
    expect(await screen.findByRole('heading', { name: 'Hi' })).toBeInTheDocument();
    expect(container.querySelector('textarea')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="markdown-view"]')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = mock();
    render(<ReadmeEditor value='# ' onChange={onChange} />);
    await user.type(screen.getByLabelText('Markdown editor'), 'Hi');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[0]?.[0]).toBe('# H');
    expect(onChange.mock.calls[1]?.[0]).toBe('# i');
  });

  it('merges custom className', () => {
    const { container } = render(
      <ReadmeEditor value='' onChange={() => {}} className='custom' />,
    );
    expect(container.firstChild).toHaveClass('custom');
  });
});
