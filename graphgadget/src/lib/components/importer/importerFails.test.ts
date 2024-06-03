import { render, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach } from 'vitest';
import Importer from './Importer.svelte';
import { DataFrame } from 'dataframe-js';
import * as fileParserModule from '$lib/components/importer/scripts/FileParser';
import { UnsupportedFileError } from '../../CustomErrors';

describe('Importer Component', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should render the component', () => {
		const { container } = render(Importer);
		expect(container).toBeTruthy();
	});

	it('should call Parse when a supported file is input and dispatch the result', async () => {
		const { getByTestId, component } = render(Importer);
		const input = getByTestId('input');
		const mockFile = new File(['content'], 'test.csv', { type: 'text/csv' });

		const mockParse = vi.spyOn(fileParserModule, 'Parse').mockResolvedValue(new DataFrame([]));
		const mockDispatch = vi.fn();
		component.$on('input', mockDispatch);

		Object.defineProperty(input, 'files', { value: [mockFile], writable: false });
		await fireEvent.input(input);

		await waitFor(() => {
			expect(mockParse).toHaveBeenCalledWith(mockFile);
			expect(mockDispatch).toHaveBeenCalled();
		});
	});

	it('should display an error message for an unsupported file type', async () => {
		const { getByTestId } = render(Importer);
		const input = getByTestId('input');
		const mockFile = new File(['content'], 'test.unsupported', { type: 'application/unsupported' });

		const mockParse = vi
			.spyOn(fileParserModule, 'Parse')
			.mockRejectedValue(new UnsupportedFileError('Unsupported file type'));

		Object.defineProperty(input, 'files', { value: [mockFile], writable: false });
		await fireEvent.input(input);

		await waitFor(() => {
			expect(mockParse).toHaveBeenCalledWith(mockFile);
			const modal = getByTestId('error-modal');
			expect(modal).toBeTruthy();
			expect(modal.textContent).toContain(
				'Unsupported file type: .unsupported. Please upload a supported file type.'
			);
		});
	});

	it('should display a generic error message for a parsing error', async () => {
		const { getByTestId } = render(Importer);
		const input = getByTestId('input');
		const mockFile = new File(['content'], 'test.csv', { type: 'text/csv' });

		const mockParse = vi
			.spyOn(fileParserModule, 'Parse')
			.mockRejectedValue(new Error('Parsing error'));

		Object.defineProperty(input, 'files', { value: [mockFile], writable: false });
		await fireEvent.input(input);

		await waitFor(() => {
			expect(mockParse).toHaveBeenCalledWith(mockFile);
			const modal = getByTestId('error-modal');
			expect(modal).toBeTruthy();
			expect(modal.textContent).toContain(
				'An error occurred while parsing the file. Please try again.'
			);
		});
	});

	it('should clear the error message when the modal is closed', async () => {
		const { getByTestId } = render(Importer);
		const input = getByTestId('input');
		const mockFile = new File(['content'], 'test.unsupported', { type: 'application/unsupported' });

		vi.spyOn(fileParserModule, 'Parse').mockRejectedValue(
			new UnsupportedFileError('Unsupported file type')
		);

		Object.defineProperty(input, 'files', { value: [mockFile], writable: false });
		await fireEvent.input(input);

		await waitFor(() => {
			const modal = getByTestId('error-modal');
			expect(modal).toBeTruthy();
			expect(modal.textContent).toContain(
				'Unsupported file type: .unsupported. Please upload a supported file type.'
			);
		});

		const closeButton = getByTestId('close-button');
		await fireEvent.click(closeButton);

		await waitFor(() => {
			expect(document.querySelector('[data-testid="error-modal"]')).toBeNull();
		});
	});
});
