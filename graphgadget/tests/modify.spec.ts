import { test, expect } from '@playwright/test';
import * as helper from './test.help';
import { tsvTestData } from './test.help';

test.describe('Modify page tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.getByTestId('input').setInputFiles({
			name: 'example.tsv',
			mimeType: 'text/tsv',
			buffer: Buffer.from(tsvTestData)
		});

		await expect(page).toHaveURL('/modify');
	});

	test('Test if all important elements are visible', async ({ page }) => {
		await expect(helper.getNavBar(page)).toBeVisible();
		await expect(helper.getFilterButton(page)).toBeVisible();
		await expect(helper.getSelectData(page)).toBeVisible();
		await expect(helper.getNextButton(page)).toBeVisible();
		await expect(helper.getFooter(page)).toBeVisible();
	});

	test('Test if specific columns from test file are visible', async ({ page }) => {
		await expect(page.getByTestId('header-Id-input')).toBeVisible();
		await expect(page.getByTestId('header-Language-input')).toBeVisible();
		await expect(page.getByTestId('header-Age-input')).toBeVisible();
		await expect(page.getByTestId('header-Gender-input')).toBeVisible();
		await expect(page.getByTestId('header-Duration(seconds)-input')).toBeVisible();
	});

	test('Test if all filter options are visible', async ({ page }) => {
		await helper.getFilterButton(page).click();
		await expect(helper.getColumnSelect(page)).toBeVisible();
		await expect(helper.getUseRangeCheckbox(page)).toBeVisible();
		await expect(helper.getSelectRange(page)).toBeVisible();
		await expect(helper.getMinRangeInput(page)).toBeVisible();
		await expect(helper.getMaxRangeInput(page)).toBeVisible();
		await expect(helper.getRemoveMatchingButton(page)).toBeVisible();
		await expect(helper.getRemoveNonMatchingButton(page)).toBeVisible();
	});
});
