import { render } from '@testing-library/svelte';
import sut from './Card.svelte';
import { it, expect } from 'vitest';

it('should render', () => {
	const { container } = render(sut);
	expect(container).toBeInTheDocument();
});
it('should find the default text in the card', () => {
	const r = render(sut);
	expect(r.getByText('input text here')).to.exist;
});
it('should find the exported text in the card', () => {
	const r = render(sut, { text: 'never gonna give you up' });
	expect(r.getByText('never gonna give you up')).to.exist;
});
