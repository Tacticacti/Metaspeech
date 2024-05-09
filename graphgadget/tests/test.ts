import { expect, test } from '@playwright/test';

test('should render', async ({ page }) => {
	await page.goto('/');
<<<<<<< HEAD
	//get file input
	const input = await page.$('input[type=file]');
	expect(input).not.toBeNull();
=======
	await expect(page.getByRole('input'));
	await expect(page.getByRole('heading', { name: 'Welcome to SvelteKit' })).toBeVisible();
>>>>>>> 133c8a67424cb0676e753f26683c61c51fdd39d7
});
