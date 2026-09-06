import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { Field } from './field';

describe('Field', () => {
  it('renders label, child, hint and error', () => {
    render(
      <Field label='Name' hint='Public title.' error='Required'>
        <input aria-label='Name' />
      </Field>,
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Public title.')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('omits error when absent', () => {
    const { container } = render(
      <Field label='Name' hint='Public title.'>
        <input aria-label='Name' />
      </Field>,
    );
    expect(container.querySelector('.text-destructive')).not.toBeInTheDocument();
  });
});
