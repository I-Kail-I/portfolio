import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';

describe('AlertDialog', () => {
  it('renders header, title, description and footer slots', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete?</AlertDialogTitle>
            <AlertDialogDescription>Confirm delete.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
    expect(screen.getByText('Delete?')).toBeInTheDocument();
    expect(screen.getByText('Confirm delete.')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="alert-dialog-header"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="alert-dialog-footer"]')).toBeInTheDocument();
  });

  it('action renders as button', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );
    expect(screen.getByText('Confirm').tagName).toBe('BUTTON');
  });
});
