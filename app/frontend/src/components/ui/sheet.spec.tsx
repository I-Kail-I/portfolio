import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from './sheet';

describe('Sheet', () => {
  it('renders header, title, description and footer', () => {
    render(
      <Sheet open>
        <SheetContent showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Nav menu.</SheetDescription>
          </SheetHeader>
          <SheetFooter>Footer</SheetFooter>
        </SheetContent>
      </Sheet>,
    );
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Nav menu.')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sheet-header"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sheet-footer"]')).toBeInTheDocument();
  });

  it('renders close button by default', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    expect(screen.getByText('Close')).toBeInTheDocument();
  });
});
