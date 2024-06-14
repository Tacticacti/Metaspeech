import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import ErrorModal from './ErrorModal.svelte';

describe('ErrorModal Component', () => {
	it('should render the error message', () => {
		const message = 'This is an error message';
		const { getByText } = render(ErrorModal, { message, visible: true });
		const errorMessageElement = getByText(message);

		expect(errorMessageElement).toBeTruthy();
		expect(errorMessageElement).toBeInTheDocument();
		expect(errorMessageElement).toHaveTextContent(message);
		expect(errorMessageElement.nodeType).toBe(Node.ELEMENT_NODE);
		expect(errorMessageElement.tagName).toEqual('P');

		expect(errorMessageElement).toBeVisible();
	});

	it('should dispatch close event when the close button is clicked', async () => {
		const message = 'This is an error message';
		const mockDispatch = vi.fn();
		const { getByRole, component } = render(ErrorModal, { message });

		// Override the dispatch method with a mock function
		component.$on('close', mockDispatch);

		const closeButton = getByRole('button', { name: /close/i });

		await fireEvent.click(closeButton);

		expect(mockDispatch).toHaveBeenCalledTimes(1);
	});
});
