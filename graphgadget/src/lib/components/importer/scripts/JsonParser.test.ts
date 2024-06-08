import { fromText } from '$lib/dataframe/DataFrame';
import { ParseJson } from './JsonParser';
import { it, expect, vi, afterEach, beforeEach } from 'vitest';

const fileReader = window.FileReader;
const toReturn = { value: 'dummy data' };

beforeEach(() => {
	// @ts-expect-error ignore
	window.FileReader = jest.fn().mockImplementation(() => ({
		readAsText: function () {
			this.onload({ target: { result: toReturn.value } });
		}
	}));
});
afterEach(() => {
	window.FileReader = fileReader;
	vi.restoreAllMocks();
});

it('should parse array-like JSON files', async () => {
	toReturn.value = '[{ "id": "dummy data" }]';
	const file = new File([], 'test.json', { type: 'application/json' });
	const result = await ParseJson(file);

	expect(result).toEqual(fromText('id\ndummy data'));
});
it('should parse object-like JSON files', async () => {
	toReturn.value = '{ "dummy": { "example": "data" }}';
	const file = new File([], 'test.json', { type: 'application/json' });
	const result = await ParseJson(file);

	expect(result).toEqual(fromText('id,example\ndummy,data'));
});
it('should reject invalid JSON files', async () => {
	toReturn.value = '"invalid json"';
	const file = new File([], 'test.json', { type: 'application/json' });
	const promise = ParseJson(file);

	await expect(promise).rejects.toThrow(Error);
});
it('should reject files with no data', async () => {
	toReturn.value = '';
	const file = new File([], 'test.json', { type: 'application/json' });
	const promise = ParseJson(file);

	await expect(promise).rejects.toThrow(Error);
});

// uncommenting the following test will cause the tests in xls to fail
// i have no clue why...

it('should throw read error', async () => {
	// @ts-expect-error ignore
	window.FileReader = vi.fn().mockImplementation(() => ({
		readAsText: function () {
			this.onerror(new Error());
		}
	}));
	const file = new File([], 'test.json', { type: 'application/json' });
	const promise = ParseJson(file);
	expect(promise).rejects.toThrow(Error);
});
