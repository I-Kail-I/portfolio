import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import {
  Toaster,
  Toast,
  ToastContent,
  ToastDescription,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
} from './toast';

describe('ToastViewport', () => {
  it('renders with data-slot', () => {
    render(
      <Toaster>
        <ToastViewport data-testid='viewport' />
      </Toaster>,
    );
    expect(screen.getByTestId('viewport')).toHaveAttribute('data-slot', 'toast-viewport');
  });

  it('merges custom className', () => {
    render(
      <Toaster>
        <ToastViewport data-testid='viewport' className='custom' />
      </Toaster>,
    );
    expect(screen.getByTestId('viewport')).toHaveClass('custom');
  });
});

describe('ToastContent', () => {
  it('renders children with data-slot', () => {
    render(
      <Toaster>
        <Toast toast={{ id: '1' }}>
          <ToastContent data-testid='content'>hello</ToastContent>
        </Toast>
      </Toaster>,
    );
    const el = screen.getByTestId('content');
    expect(el).toHaveAttribute('data-slot', 'toast-content');
    expect(el).toHaveTextContent('hello');
  });
});

describe('ToastTitle', () => {
  it('renders title text', () => {
    render(
      <Toaster>
        <Toast toast={{ id: '1' }}>
          <ToastTitle>Saved</ToastTitle>
        </Toast>
      </Toaster>,
    );
    const el = screen.getByText('Saved');
    expect(el).toHaveAttribute('data-slot', 'toast-title');
  });

  it('renders title from toast object', () => {
    render(
      <Toaster>
        <Toast toast={{ id: '1', title: 'From object' }}>
          <ToastTitle />
        </Toast>
      </Toaster>,
    );
    expect(screen.getByText('From object')).toBeInTheDocument();
  });
});

describe('ToastDescription', () => {
  it('renders description text', () => {
    render(
      <Toaster>
        <Toast toast={{ id: '1' }}>
          <ToastDescription>All done</ToastDescription>
        </Toast>
      </Toaster>,
    );
    const el = screen.getByText('All done');
    expect(el).toHaveAttribute('data-slot', 'toast-description');
  });

  it('renders full toast structure', () => {
    render(
      <Toaster>
        <Toast toast={{ id: '1', title: 'Saved', description: 'All done' }}>
          <ToastContent>
            <ToastTitle />
            <ToastDescription />
          </ToastContent>
        </Toast>
      </Toaster>,
    );
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('All done')).toBeInTheDocument();
  });
});

describe('Toaster', () => {
  it('renders children', () => {
    render(
      <Toaster>
        <span>page body</span>
      </Toaster>,
    );
    expect(screen.getByText('page body')).toBeInTheDocument();
  });
});

describe('toast manager', () => {
  it('default export exposes add and close', () => {
    expect(typeof toast.add).toBe('function');
    expect(typeof toast.close).toBe('function');
  });

  it('createToastManager builds independent manager', () => {
    const manager = createToastManager();
    expect(typeof manager.add).toBe('function');
    expect(manager).not.toBe(toast);
  });
});
