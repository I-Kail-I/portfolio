import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

describe('Table', () => {
  it('renders table with slots', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Jane</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Footer</TableCell>
          </TableRow>
        </TableFooter>
        <TableCaption>Caption</TableCaption>
      </Table>,
    );

    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Caption')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="table"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="table-header"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="table-body"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="table-footer"]')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(
      <Table className='custom-table'>
        <TableBody>
          <TableRow>
            <TableCell>Hi</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(document.querySelector('[data-slot="table"]')).toHaveClass('custom-table');
  });
});
