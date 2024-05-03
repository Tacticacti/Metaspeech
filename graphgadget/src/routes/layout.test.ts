import { describe, it, expect } from 'vitest';
import { prerender } from './+layout';

describe('prerender value', () => {
	it('should be true', () => {
		expect(prerender).toBe(true);
	});
});
