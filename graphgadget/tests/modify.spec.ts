import { test, expect } from '@playwright/test';
import * as helper from './test.help';
import { tsvTestData, tsvTestDataTwo, tsvCorruptedTestData } from './test.help';

test.describe('Modify page tests', () => {
	test.describe('Page layout tests', () => {
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
	});

	test.describe('Filter options tests', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/');
			await page.getByTestId('input').setInputFiles({
				name: 'example.tsv',
				mimeType: 'text/tsv',
				buffer: Buffer.from(tsvTestData)
			});

			await expect(page).toHaveURL('/modify');
			await helper.getFilterButton(page).click();
		});

		test('Test if all filter options are visible', async ({ page }) => {
			await expect(helper.getColumnSelect(page)).toBeVisible();
			await expect(helper.getRangeCheckbox(page)).toBeVisible();
			await expect(helper.getSelectRange(page)).toBeVisible();
			await expect(helper.getMinRangeInput(page)).toBeVisible();
			await expect(helper.getMaxRangeInput(page)).toBeVisible();
			await expect(helper.getRemoveMatchingButton(page)).toBeVisible();
			await expect(helper.getRemoveNonMatchingButton(page)).toBeVisible();
		});

		test('Test if filter options contain expected information', async ({ page }) => {
			await expect(helper.getColumnSelect(page)).toHaveValue('Id');
			await expect(helper.getRangeCheckbox(page)).toBeChecked();
			await expect(helper.getMinRangeInput(page)).toHaveValue('0');
			await expect(helper.getMaxRangeInput(page)).toHaveValue('0');
		});

		test('Test changing filter column', async ({ page }) => {
			const columnSelect = helper.getColumnSelect(page);

			await expect(columnSelect).toBeVisible();
			await expect(helper.getRangeCheckbox(page)).toBeVisible();

			await columnSelect.selectOption({ label: 'Language' });
			await expect(columnSelect).toHaveValue('Language');
			await expect(helper.getTextFilterInput(page)).toBeVisible();
			await expect(helper.getRangeCheckbox(page)).not.toBeVisible();
		});

		test('Test checking and unchecking checkbox for numerical columns', async ({ page }) => {
			const checkbox = helper.getRangeCheckbox(page);

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

			await checkbox.click();

			await expect(checkbox).not.toBeChecked();

			await helper.getTextFilterInput(page).fill('1');
			await removeNonMatchingButton.click();

			await expect(page.getByTestId('1-cell')).toBeVisible();
			await expect(page.getByTestId('2-cell')).not.toBeVisible();
			await expect(page.getByTestId('3-cell')).not.toBeVisible();
		});

		test('Test remove matching button using text filter input for string column', async ({
			page
		}) => {
			const columnSelect = helper.getColumnSelect(page);
			const removeMatchingButton = helper.getRemoveMatchingButton(page);

			await columnSelect.selectOption({ label: 'Language' });

			await helper.getTextFilterInput(page).fill('EN');
			await removeMatchingButton.click();

			await expect(page.getByTestId('1-cell')).not.toBeVisible();
			await expect(page.getByTestId('2-cell')).toBeVisible();
			await expect(page.getByTestId('3-cell')).toBeVisible();
		});

		test('Test remove nonmatching button using text filter input for string column', async ({
			page
		}) => {
			const columnSelect = helper.getColumnSelect(page);
			const removeNonMatchingButton = helper.getRemoveNonMatchingButton(page);

			await columnSelect.selectOption({ label: 'Language' });

			await helper.getTextFilterInput(page).fill('EN');
			await removeNonMatchingButton.click();

			await expect(page.getByTestId('1-cell')).toBeVisible();
			await expect(page.getByTestId('2-cell')).not.toBeVisible();
			await expect(page.getByTestId('3-cell')).not.toBeVisible();
		});
	});

	test.describe('Warning for null value tests', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/');
			await page.getByTestId('input').setInputFiles({
				name: 'example.tsv',
				mimeType: 'text/tsv',
				buffer: Buffer.from(tsvCorruptedTestData)
			});

			await expect(page).toHaveURL('/modify');
		});

		test('Test if warning elements are visible', async ({ page }) => {
			await expect(helper.getWarningText(page)).toBeVisible();
			await expect(helper.getRemoveMissingButton(page)).toBeVisible();
		});

		test('Test if warning elements contain expected information', async ({ page }) => {
			await expect(helper.getWarningText(page)).toHaveText(
				'Warning: Missing values detected in [Duration(seconds), Gender]'
			);
		});

		test('Test if expected rows are removed', async ({ page }) => {
			const removeMissingButton = helper.getRemoveMissingButton(page);

			await expect(
				page.getByRole('row', { name: '1EN 19 M 100 null' }).getByTestId('null-cell')
			).toBeVisible();
			await expect(page.getByTestId('null-cell').nth(1)).toBeVisible();
			await expect(page.getByTestId('null-cell').nth(2)).toBeVisible();

			await removeMissingButton.click();

			await expect(page.getByTestId('1-cell')).not.toBeVisible();
			await expect(page.getByTestId('2-cell')).not.toBeVisible();
			await expect(page.getByTestId('3-cell')).toBeVisible();
		});
	});

	test.describe('Column modify tests', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/');
			await page.getByTestId('input').setInputFiles({
				name: 'example.tsv',
				mimeType: 'text/tsv',
				buffer: Buffer.from(tsvTestData)
			});

			await expect(page).toHaveURL('/modify');
		});

		test('Test renaming column', async ({ page }) => {
			const columnInput = page.getByTestId('header-Id-input');

			await columnInput.dblclick();
			await columnInput.fill('Test_Name');
			await helper.getFilterButton(page).click();

			await expect(page.getByTestId('header-Test_Name-input')).toBeVisible();
			await expect(columnInput).not.toBeVisible();
		});

		test('Test deleting column', async ({ page }) => {
			const columnDeleteButton = page.getByTestId('header-Id-delete');
			const columnInput = page.getByTestId('header-Id-input');

			await columnDeleteButton.click();

			await expect(columnInput).not.toBeVisible();
			await expect(page.getByTestId('1-cell')).not.toBeVisible();
			await expect(page.getByTestId('2-cell')).not.toBeVisible();
			await expect(page.getByTestId('3-cell')).not.toBeVisible();
		});
	});

	test.describe('Merge file tests', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/');
			await page.getByTestId('input').setInputFiles({
				name: 'example.tsv',
				mimeType: 'text/tsv',
				buffer: Buffer.from(tsvTestData)
			});

			await expect(page).toHaveURL('/modify');

			await helper.getSelectData(page).setInputFiles({
				name: 'example2.tsv',
				mimeType: 'text/tsv',
				buffer: Buffer.from(tsvTestDataTwo)
			});
		});

		test('Test if all elements are visible', async ({ page }) => {
			await expect(helper.getInfoButton(page)).toBeVisible();
			await expect(helper.getColumnOneSelect(page)).toBeVisible();
			await expect(helper.getColumnTwoSelect(page)).toBeVisible();
			await expect(helper.getMergeIndexButton(page)).toBeVisible();
			await expect(helper.getMergeKeyedButton(page)).toBeVisible();
		});

		test('Test elements contain expected information', async ({ page }) => {
			await expect(helper.getColumnOneSelect(page)).toHaveValue('Id');
			await expect(helper.getColumnTwoSelect(page)).toHaveValue('Column_1');

			const infoButton = helper.getInfoButton(page);
			await infoButton.hover();

			const tooltip = page.getByTestId('info-bubble');
			await expect(tooltip).toBeVisible();
			await expect(tooltip).toContainText(/Use the Index merge to attach columns in their index/);
		});

		test('Test index merge button', async ({ page }) => {
			const indexMergeButton = helper.getMergeIndexButton(page);

			await indexMergeButton.click();

			await expect(page.getByTestId('header-Column_1-input')).toBeVisible();
			await expect(page.getByTestId('header-Column_2-input')).toBeVisible();
		});

		test('Test keyed merge button', async ({ page }) => {
			const keyedMergeButton = helper.getMergeKeyedButton(page);

			await keyedMergeButton.click();

			await expect(page.getByTestId('header-Column_1-input')).not.toBeVisible();
			await expect(page.getByTestId('header-Column_2-input')).toBeVisible();
		});
	});
});
