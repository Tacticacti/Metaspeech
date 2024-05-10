import { fireEvent, render } from '@testing-library/svelte';
import { afterEach, describe, it, expect, vi } from 'vitest';
import sut from './Importer.svelte';
import * as fileParserModule from './scripts/FileParser';
import { DataFrame } from 'dataframe-js';

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

// Mocking the file parser module to control its behavior
vi.mock('./scripts/FileParser', () => ({
	Parse: vi.fn(() => Promise.resolve(new DataFrame([])))
}));

describe('Importer', () => {
	// Clean up mocks after each test run
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should call Parse when a file is input and dispatch the result', async () => {
		// Render the Importer component and destructure utility functions from the returned object
		const { getByTestId, component } = render(sut);

		const input = getByTestId('input');

		// Create a mock file object to simulate a file upload
		const mockFile = new File(['content'], 'test.xls', { type: 'application/vnd.ms-excel' });

		// Set files property directly on the input element to simulate the file selection
		Object.defineProperty(input, 'files', {
			value: [mockFile],
			writable: false
		});

		// Prepare to capture the dispatched event using a Promise
		const dispatched = new Promise((resolve) => {
			component.$on('input', (event) => {
				resolve(event.detail); // Capture the detail of the 'input' event when it is dispatched
			});
		});

		// Simulate the input event to trigger the onInput function in the component
		await fireEvent.input(input);

		// Assert that the Parse function was called with the mocked file
		expect(fileParserModule.Parse).toHaveBeenCalledWith(mockFile);

		// Await for any pending Promises to resolve, ensuring all asynchronous actions have completed
		await new Promise((resolve) => setTimeout(resolve, 0));

		// Check if the 'input' event was dispatched with the expected data, which should be a DataFrame instance
		const result = await dispatched;
		expect(result).toBeInstanceOf(DataFrame); // Verify that the result is indeed an instance of DataFrame
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
