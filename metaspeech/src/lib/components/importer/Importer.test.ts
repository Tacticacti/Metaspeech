import { fireEvent, render } from '@testing-library/svelte';
import { afterEach, describe, it, expect, vi } from 'vitest';
import Importer from './Importer.svelte';
import * as fileParserModule from './scripts/FileParser';
import type { DataFile } from '$lib/Types';
import { fromText } from '$lib/dataframe/DataFrame';
import { UnsupportedFileError } from '$lib/Types';

// Mocking the file parser module to control its behavior
vi.mock('./scripts/FileParser', async () => {
	const originalModule = await vi.importActual<typeof fileParserModule>('./scripts/FileParser');
	return {
		...originalModule,
		Parse: vi.fn(() => Promise.resolve(fromText('a,b\n1,2\n3,4\n5,6')))
	};
});

describe('Page', () => {
	it('should render', () => {
		const { container } = render(Importer);
		expect(container).to.exist;
	});

	it('check for input', () => {
		const { getByTestId } = render(Importer);

		const input = getByTestId('input');
		expect(input).toBeDefined();
	});
});

describe('Importer', () => {
	// Clean up mocks after each test run
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should call Parse when a file is input and dispatch the result', async () => {
		// Render the Importer component and destructure utility functions from the returned object
		const { getByTestId, component } = render(Importer);

		const input = getByTestId('input');

		// Create a mock file object to simulate a file upload
		const mockFile = new File(['content'], 'test.xls', { type: 'application/vnd.ms-excel' });

		// Set files property directly on the input element to simulate the file selection
		Object.defineProperty(input, 'files', {
			value: [mockFile],
			writable: false
		});

		// Prepare to capture the dispatched event using a Promise
		const dispatched = new Promise<DataFile>((resolve) => {
			component.$on('input', (event: CustomEvent<DataFile>) => {
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
		const result: DataFile = await dispatched;
		expect(result.data).toEqual(fromText('a,b\n1,2\n3,4\n5,6')); // Verify that the result is indeed an instance of DataFrame
	});

	it('should not call Parse if no file is selected', async () => {
		const { getByTestId } = render(Importer);
		const input = getByTestId('input');

		// Simulate the input event with no file selected
		Object.defineProperty(input, 'files', {
			value: [], // No files selected
			writable: false
		});

		const promise = fireEvent.input(input);
		await promise;

		// Using a timeout to ensure all async actions inside the input handler are settled
		await new Promise((resolve) => setTimeout(resolve, 0));

		// Check that Parse was not called since no file was selected
		expect(fileParserModule.Parse).not.toHaveBeenCalled();
	});

	it('should display an error modal when an unsupported file is uploaded', async () => {
		// Mock the Parse function to throw an UnsupportedFileError
		(fileParserModule.Parse as jest.Mock).mockImplementationOnce(() => {
			throw new UnsupportedFileError('Unsupported file type found.');
		});

		const { getByTestId, findByTestId } = render(Importer);

		const input = getByTestId('input');
		const mockFile = new File(['content'], 'test.unsupported', { type: 'application/unsupported' });

		Object.defineProperty(input, 'files', {
			value: [mockFile],
			writable: false
		});

		await fireEvent.input(input);

		// Wait for the error modal to appear
		const errorModal = await findByTestId('error-modal');
		expect(errorModal).toBeDefined();
		expect(errorModal.textContent).toContain(
			'Invalid file input! .unsupported is not supported in this application!'
		);
	});

	it('should display an error modal for an unknown error', async () => {
		// Mock the Parse function to throw a generic error
		(fileParserModule.Parse as jest.Mock).mockImplementationOnce(() => {
			throw new Error('Generic error');
		});

		const { getByTestId, findByTestId } = render(Importer);

		const input = getByTestId('input');
		const mockFile = new File(['content'], 'test.csv', { type: 'text/csv' });

		Object.defineProperty(input, 'files', {
			value: [mockFile],
			writable: false
		});

		await fireEvent.input(input);

		// Wait for the error modal to appear
		const errorModal = await findByTestId('error-modal');
		expect(errorModal).toBeDefined();
		expect(errorModal.textContent).toContain(
			'An unknown error occurred while processing the file.'
		);
	});

	it('should close the error modal and reset the error message', async () => {
		const { getByTestId, findByTestId, component } = render(Importer);

		// Simulate setting an error state
		const input = getByTestId('input');
		const mockFile = new File(['content'], 'test.unsupported', { type: 'application/unsupported' });

		(fileParserModule.Parse as jest.Mock).mockImplementationOnce(() => {
			throw new UnsupportedFileError('Unsupported file type found.');
		});

		Object.defineProperty(input, 'files', {
			value: [mockFile],
			writable: false
		});

		await fireEvent.input(input);

		// Wait for the error modal to appear
		const errorModal = await findByTestId('error-modal');
		expect(errorModal).toBeDefined();

		// Close the modal
		const closeButton = getByTestId('close-button');
		await fireEvent.click(closeButton);

		// Use the component's instance to check the updated state
		expect(component.$$.ctx[component.$$.props.errorMessage]).toBeNull();
		expect(component.$$.ctx[component.$$.props.isModalVisible]).toBe(false);
	});
});
