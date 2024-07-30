import { usePathname } from 'next/navigation';

import { cleanup, render, screen, waitFor } from '@testing-library/react';

import '@testing-library/jest-dom';
import ChipsGroup from '@/components/ui/chips/chips-group';

// Mock usePathname to return a specific path
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('ChipsGroup', () => {
  const options = [
    { value: 'value1', label: 'Label 1' },
    { value: 'value2', label: 'Label 2' },
    { value: 'value3', label: 'Label 3' },
  ];

  beforeEach(() => {
    // TypeScript doesn't know that usePathname is a mock function, so we cast it
    (usePathname as jest.Mock).mockReturnValue('/smartdata/agriculture');
  });

  afterEach(() => {
    // Cleanup after each test to remove rendered components from the DOM
    cleanup();
  });

  test('renders Chips Group label correctly', () => {
    render(
      <ChipsGroup
        smartdataFilterKey="filterKey"
        label="Chips Group Label"
        options={options}
        defaultValues={['value1']}
      />
    );

    expect(screen.getByText('Chips Group Label')).toBeInTheDocument();
  });

  //test('selects the default value on render', async () => {
  //  const defaultValues = ['value2', 'value3'];

  //  render(
  //    <ChipsGroup
  //      smartdataFilterKey="filterKey"
  //      label="Chips Group Label"
  //      options={options}
  //      defaultValues={defaultValues}
  //    />
  //  );

  //  await waitFor(() => {
  //    const label1Option = screen.getByText('Label 1');
  //    const label2Option = screen.getByText('Label 2');
  //    const label3Option = screen.getByText('Label 3');

  //    expect(label1Option).not.toHaveClass(/selected/);
  //    expect(label2Option).toHaveClass(/selected/);
  //    expect(label3Option).toHaveClass(/selected/);
  //  });
  //});
});
