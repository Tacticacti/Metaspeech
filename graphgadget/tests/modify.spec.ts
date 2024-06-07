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

	test('Test if expected columns from test data are visible', async ({ page }) => {
		await expect(page.getByTestId('header-Id-input')).toBeVisible();
		await expect(page.getByTestId('header-Language-input')).toBeVisible();
		await expect(page.getByTestId('header-Age-input')).toBeVisible();
		await expect(page.getByTestId('header-Gender-input')).toBeVisible();
		await expect(page.getByTestId('header-Duration(seconds)-input')).toBeVisible();
	});

	test('Test if all filter options are visible and contains expected information', async ({
		page
	}) => {
		await helper.getFilterButton(page).click();

		await expect(helper.getColumnSelect(page)).toBeVisible();
		await expect(helper.getRangeCheckbox(page)).toBeVisible();
		await expect(helper.getSelectRange(page)).toBeVisible();
		await expect(helper.getMinRangeInput(page)).toBeVisible();
		await expect(helper.getMaxRangeInput(page)).toBeVisible();
		await expect(helper.getRemoveMatchingButton(page)).toBeVisible();
		await expect(helper.getRemoveNonMatchingButton(page)).toBeVisible();
	});

	test('Test if filter options contain expected information', async ({ page }) => {
		await helper.getFilterButton(page).click();
		const selectedOption = await helper.getColumnSelect(page).evaluate((select) => select.value);

		expect(selectedOption).toBe('Id');
		await expect(helper.getRangeCheckbox(page)).toBeChecked();

		const minValue = await helper.getMinRangeInput(page).inputValue();
		const maxValue = await helper.getMaxRangeInput(page).inputValue();

		expect(minValue).toBe('0');
		expect(maxValue).toBe('0');
	});

	test('Test changing filter column', async ({ page }) => {
		const columnSelect = helper.getColumnSelect(page);

		await helper.getFilterButton(page).click();

		await expect(columnSelect).toBeVisible();
		await expect(helper.getRangeCheckbox(page)).toBeVisible();

		await columnSelect.selectOption({ label: 'Language' });
		const selectedOption = await columnSelect.evaluate((select) => select.value);

		expect(selectedOption).toBe('Language');
		await expect(helper.getTextFilterInput(page)).toBeVisible();
		await expect(helper.getRangeCheckbox(page)).not.toBeVisible();
	});

	test('Test checking and unchecking checkbox for numerical columns', async ({ page }) => {
		const checkbox = helper.getRangeCheckbox(page);

		await helper.getFilterButton(page).click();

		await expect(checkbox).toBeChecked();
		await expect(helper.getMinRangeInput(page)).toBeVisible();
		await expect(helper.getMaxRangeInput(page)).toBeVisible();
		await expect(helper.getTextFilterInput(page)).not.toBeVisible();

		await checkbox.click();

		await expect(checkbox).toBeVisible();
		await expect(checkbox).not.toBeChecked();
		await expect(helper.getMinRangeInput(page)).not.toBeVisible();
		await expect(helper.getMaxRangeInput(page)).not.toBeVisible();
		await expect(helper.getTextFilterInput(page)).toBeVisible();
	});

	test('Test remove matching button', async ({ page }) => {
		const removeMatchingButton = helper.getRemoveMatchingButton(page);
		const minRangeInput = helper.getMinRangeInput(page);
		const maxRangeInput = helper.getMaxRangeInput(page);

		await helper.getFilterButton(page).click();
		await minRangeInput.fill('1');
		await maxRangeInput.fill('2');
		await removeMatchingButton.click();

		await expect(page.getByTestId('1-cell')).not.toBeVisible();
		await expect(page.getByTestId('2-cell')).not.toBeVisible();
		await expect(page.getByTestId('3-cell')).toBeVisible();
	});

	test('Test remove nonmatching button', async ({ page }) => {
		const removeNonMatchingButton = helper.getRemoveNonMatchingButton(page);
		const minRangeInput = helper.getMinRangeInput(page);
		const maxRangeInput = helper.getMaxRangeInput(page);

		await helper.getFilterButton(page).click();
		await minRangeInput.fill('1');
		await maxRangeInput.fill('2');
		await removeNonMatchingButton.click();

		await expect(page.getByTestId('1-cell')).toBeVisible();
		await expect(page.getByTestId('2-cell')).toBeVisible();
		await expect(page.getByTestId('3-cell')).not.toBeVisible();
	});

	test('Test remove matching button using text filter input for numerical column', async ({
		page
	}) => {
		const checkbox = helper.getRangeCheckbox(page);
		const removeMatchingButton = helper.getRemoveMatchingButton(page);

		await helper.getFilterButton(page).click();
		await checkbox.click();

		await expect(checkbox).not.toBeChecked();

		await helper.getTextFilterInput(page).fill('1');
		await removeMatchingButton.click();

		await expect(page.getByTestId('1-cell')).not.toBeVisible();
		await expect(page.getByTestId('2-cell')).toBeVisible();
		await expect(page.getByTestId('3-cell')).toBeVisible();
	});

	test('Test remove nonmatching button using text filter input for numerical column', async ({
		page
	}) => {
		const checkbox = helper.getRangeCheckbox(page);
		const removeNonMatchingButton = helper.getRemoveNonMatchingButton(page);

		await helper.getFilterButton(page).click();
		await checkbox.click();

		await expect(checkbox).not.toBeChecked();

		await helper.getTextFilterInput(page).fill('1');
		await removeNonMatchingButton.click();

		await expect(page.getByTestId('1-cell')).toBeVisible();
		await expect(page.getByTestId('2-cell')).not.toBeVisible();
		await expect(page.getByTestId('3-cell')).not.toBeVisible();
	});

	test('Test remove matching button using text filter input for text column', async ({ page }) => {
		const columnSelect = helper.getColumnSelect(page);
		const removeMatchingButton = helper.getRemoveMatchingButton(page);

		await helper.getFilterButton(page).click();
		await columnSelect.selectOption({ label: 'Language' });

		await helper.getTextFilterInput(page).fill('EN');
		await removeMatchingButton.click();

		await expect(page.getByTestId('1-cell')).not.toBeVisible();
		await expect(page.getByTestId('2-cell')).toBeVisible();
		await expect(page.getByTestId('3-cell')).toBeVisible();
	});

	test('Test remove nonmatching button using text filter input for text column', async ({
		page
	}) => {
		const columnSelect = helper.getColumnSelect(page);
		const removeNonMatchingButton = helper.getRemoveNonMatchingButton(page);

		await helper.getFilterButton(page).click();
		await columnSelect.selectOption({ label: 'Language' });

		await helper.getTextFilterInput(page).fill('EN');
		await removeNonMatchingButton.click();

		await expect(page.getByTestId('1-cell')).toBeVisible();
		await expect(page.getByTestId('2-cell')).not.toBeVisible();
		await expect(page.getByTestId('3-cell')).not.toBeVisible();
	});
});
