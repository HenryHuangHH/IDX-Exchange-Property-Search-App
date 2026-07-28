import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyFilters from '../components/PropertyFilters';

describe('PropertyFilters', () => {
  it('renders all filter fields and action buttons', () => {
    render(<PropertyFilters onApply={jest.fn()} />);

    expect(screen.getByLabelText('City')).toBeInTheDocument();
    expect(screen.getByLabelText('ZIP Code')).toBeInTheDocument();
    expect(screen.getByLabelText('Min Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Max Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Beds')).toBeInTheDocument();
    expect(screen.getByLabelText('Baths')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('calls onApply with the entered filter values on submit', async () => {
    const user = userEvent.setup();
    const onApply = jest.fn();
    render(<PropertyFilters onApply={onApply} />);

    await user.type(screen.getByLabelText('City'), 'Ann Arbor');
    await user.type(screen.getByLabelText('ZIP Code'), '48104');
    await user.type(screen.getByLabelText('Min Price'), '100000');
    await user.selectOptions(screen.getByLabelText('Beds'), '3');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onApply).toHaveBeenCalledWith({
      city: 'Ann Arbor',
      zipcode: '48104',
      minPrice: '100000',
      maxPrice: '',
      beds: '3',
      baths: '',
    });
  });

  it('does not submit until the Search button is clicked', async () => {
    const user = userEvent.setup();
    const onApply = jest.fn();
    render(<PropertyFilters onApply={onApply} />);

    await user.type(screen.getByLabelText('City'), 'Detroit');

    expect(onApply).not.toHaveBeenCalled();
  });

  it('resets the form fields and calls onApply with empty filters on Reset', async () => {
    const user = userEvent.setup();
    const onApply = jest.fn();
    render(<PropertyFilters onApply={onApply} />);

    await user.type(screen.getByLabelText('City'), 'Ann Arbor');
    await user.type(screen.getByLabelText('Max Price'), '500000');
    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(screen.getByLabelText('City')).toHaveValue('');
    expect(screen.getByLabelText('Max Price')).toHaveValue(null);
    expect(onApply).toHaveBeenCalledWith({
      city: '',
      zipcode: '',
      minPrice: '',
      maxPrice: '',
      beds: '',
      baths: '',
    });
  });
});
