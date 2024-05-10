import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import sut from './Importer.svelte'; // Update the import path to your Svelte file

describe('Page', () => {
	it('should render', () => {
		const { container } = render(sut);
		expect(container).to.exist;
	});
	it('check for input', () => {
		const { getByTestId } = render(sut);

		const input = getByTestId('input');
		expect(input).toBeDefined();
	});
});

//doesn't work
// it('importer pass tsv', async () => {
//     const testData = [
//         ['Name', 'Age', 'Location'],
//         ['John', '30', 'New York'],
//         ['Alice', '25', 'London'],
//         ['Bob', '40', 'Paris']
//     ];
//     const file = new File(createTSVFile(testData), "testdata.tsv", { type: "text/tab-separated-values" });
// 	const { component , getByTestId} = render(sut);

//     const eventListenerMock = vi.fn();
//     component.$on('input', eventListenerMock);

//     const input = getByTestId('input');

//     await waitFor(() =>
//         fireEvent.change(input, {
//           target: { files: [file] },
//         })
//     );

//     expect(eventListenerMock).toHaveBeenCalled();
// });
