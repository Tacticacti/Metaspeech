import { render } from '@testing-library/svelte';
import sut from './GraphImageExport.svelte';
import { it, expect } from 'vitest';

it('should render', () => {
	const { container } = render(sut);
	expect(container).toBeDefined();
});
