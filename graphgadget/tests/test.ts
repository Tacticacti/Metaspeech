import { test, expect } from '@playwright/test';

test('should render', async ({ page }) => {
	await page.goto('/');
	//get file input
	const input = await page.$('input[type=file]');
	expect(input).not.toBeNull;
});
