import { render } from '@testing-library/svelte';
import TableView from './TableView.svelte';
import DataFrame from 'dataframe-js';
import '@testing-library/jest-dom';

describe('TableView', () => {
  it('should render a table with headers and rows based on provided data', async () => {
    // Create a mock DataFrame
    const mockData = new DataFrame([
      { col1: 'Row1Col1', col2: 'Row1Col2' },
      { col1: 'Row2Col1', col2: 'Row2Col2' }
    ], ['col1', 'col2']);

    // Render the component with mock data
    const { getByText } = render(TableView, { data: mockData });

    // Check if headers are present
    expect(getByText('col1')).toBeInTheDocument();
    expect(getByText('col2')).toBeInTheDocument();

    // Check if data is present
    expect(getByText('Row1Col1')).toBeInTheDocument();
    expect(getByText('Row1Col2')).toBeInTheDocument();
    expect(getByText('Row2Col1')).toBeInTheDocument();
    expect(getByText('Row2Col2')).toBeInTheDocument();
  });
});
