import { test, expect } from '@playwright/test';
import * as helper from './test.help';
import {
	tsvTestData,
	tsvTestDataTwo,
	tsvCorruptedTestData,
	jsonTestData,
	jsonCorruptedTestData
} from './testData.help';

test.describe('Modify page tests', () => {
	test.describe('Page layout tests', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/');
			await helper.getImporterInput(page).setInputFiles({
				name: 'example.tsv',
				mimeType: 'text/tsv',
				buffer: Buffer.from(tsvTestData)
			});

			await expect(page).toHaveURL('/modify');
		});

		test('Test if all important elements are visible', async ({ page }) => {
			await expect(helper.getNavBar(page)).toBeVisible();
			await expect(helper.getFilterButton(page)).toBeVisible();
			await expect(helper.getAppendFile(page)).toBeVisible();
			await expect(helper.getNextButton(page)).toBeVisible();
			await expect(helper.getFooter(page)).toBeVisible();
		});

		test('Test if expected columns from test data are visible', async ({ page }) => {
			await expect(helper.getColumnHeaderInput(page, 'Id')).toBeVisible();
			await expect(helper.getColumnHeaderInput(page, 'Language')).toBeVisible();
			await expect(helper.getColumnHeaderInput(page, 'Age')).toBeVisible();
			await expect(helper.getColumnHeaderInput(page, 'Gender')).toBeVisible();
			await expect(helper.getColumnHeaderInput(page, 'Duration(seconds)')).toBeVisible();
		});
	});

	test.describe('Filter options tests', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/');
			await helper.getImporterInput(page).setInputFiles({
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
			await expect(helper.getRangeCheckbox(page)).toBeChecked();
			await expect(helper.getMinRangeInput(page)).toHaveValue('');
			await expect(helper.getMaxRangeInput(page)).toHaveValue('');
		});

		test('Test changing filter column', async ({ page }) => {
			const columnSelect = helper.getColumnSelect(page);

			await expect(columnSelect).toBeVisible();
			await expect(helper.getRangeCheckbox(page)).toBeVisible();

			await columnSelect.selectOption({ label: 'Language' });
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

			await expect(helper.getTableCell(page, '1')).not.toBeVisible();
			await expect(helper.getTableCell(page, '2')).not.toBeVisible();
			await expect(helper.getTableCell(page, '3')).toBeVisible();
		});

		test('Test remove nonmatching button', async ({ page }) => {
			const removeNonMatchingButton = helper.getRemoveNonMatchingButton(page);
			const minRangeInput = helper.getMinRangeInput(page);
			const maxRangeInput = helper.getMaxRangeInput(page);

			await minRangeInput.fill('1');
			await maxRangeInput.fill('2');
			await removeNonMatchingButton.click();

			await expect(helper.getTableCell(page, '1')).toBeVisible();
			await expect(helper.getTableCell(page, '2')).toBeVisible();
			await expect(helper.getTableCell(page, '3')).not.toBeVisible();
		});

		test('Test remove matching button using text filter input for numerical column', async ({
			page
		}) => {
			const checkbox = helper.getRangeCheckbox(page);
			const removeMatchingButton = helper.getRemoveMatchingButton(page);

			await checkbox.uncheck();
			await helper.getTextFilterInput(page).fill('1');
			await removeMatchingButton.click();

			await expect(helper.getTableCell(page, '1')).not.toBeVisible();
			await expect(helper.getTableCell(page, '2')).toBeVisible();
			await expect(helper.getTableCell(page, '3')).toBeVisible();
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

			await expect(helper.getTableCell(page, '1')).toBeVisible();
			await expect(helper.getTableCell(page, '2')).not.toBeVisible();
			await expect(helper.getTableCell(page, '3')).not.toBeVisible();
		});

		test('Test remove matching button using text filter input for string column', async ({
			page
		}) => {
			const columnSelect = helper.getColumnSelect(page);
			const removeMatchingButton = helper.getRemoveMatchingButton(page);

			await columnSelect.selectOption({ label: 'Language' });

			await helper.getTextFilterInput(page).fill('EN');
			await removeMatchingButton.click();

			await expect(helper.getTableCell(page, '1')).not.toBeVisible();
			await expect(helper.getTableCell(page, '2')).toBeVisible();
			await expect(helper.getTableCell(page, '3')).toBeVisible();
		});

		test('Test remove nonmatching button using text filter input for string column', async ({
			page
		}) => {
			const columnSelect = helper.getColumnSelect(page);
			const removeNonMatchingButton = helper.getRemoveNonMatchingButton(page);

			await columnSelect.selectOption({ label: 'Language' });

			await helper.getTextFilterInput(page).fill('EN');
			await removeNonMatchingButton.click();

			await expect(helper.getTableCell(page, '1')).toBeVisible();
			await expect(helper.getTableCell(page, '2')).not.toBeVisible();
			await expect(helper.getTableCell(page, '3')).not.toBeVisible();
		});

		test.describe('Invalid filter inputs', () => {
			test.beforeEach(async ({ page }) => {
				await expect(helper.getErrorModal(page)).not.toBeVisible();
				await expect(helper.getCloseErrorModal(page)).not.toBeVisible();
			});

			test('Test no matching values in string filter', async ({ page }) => {
				const errorModal = helper.getErrorModal(page);
				const closeButton = helper.getCloseErrorModal(page);

				await helper.getRangeCheckbox(page).uncheck();
				await helper.getTextFilterInput(page).fill('10');
				await helper.getRemoveMatchingButton(page).click();

				await expect(errorModal).toBeVisible();
				await expect(closeButton).toBeVisible();
				await expect(errorModal).toHaveText(
					'No matching rows found for value "10" in column "Id". Close'
				);
			});

			test('Test no matching range in string filter', async ({ page }) => {
				const errorModal = helper.getErrorModal(page);
				const closeButton = helper.getCloseErrorModal(page);

				await helper.getMinRangeInput(page).fill('5');
				await helper.getMaxRangeInput(page).fill('10');
				await helper.getRemoveMatchingButton(page).click();

				await expect(errorModal).toBeVisible();
				await expect(closeButton).toBeVisible();
				await expect(errorModal).toHaveText(
					'No matching rows found for range 5-10 in column "Id". Close '
				);
			});

			test('Test invalid range where min > max', async ({ page }) => {
				const errorModal = helper.getErrorModal(page);
				const closeButton = helper.getCloseErrorModal(page);

				await helper.getMinRangeInput(page).fill('10');
				await helper.getMaxRangeInput(page).fill('1');
				await helper.getRemoveMatchingButton(page).click();

				await expect(errorModal).toBeVisible();
				await expect(closeButton).toBeVisible();
				await expect(errorModal).toHaveText('Please enter valid range values. Close ');
			});

			test('Test invalid range where min and max values are empty', async ({ page }) => {
				const errorModal = helper.getErrorModal(page);
				const closeButton = helper.getCloseErrorModal(page);

				await helper.getRemoveMatchingButton(page).click();

				await expect(errorModal).toBeVisible();
				await expect(closeButton).toBeVisible();
				await expect(errorModal).toHaveText('Please enter valid range values. Close');
			});

			test.afterEach(async ({ page }) => {
				await helper.getCloseErrorModal(page).click();
			});
		});
	});

	test.describe('Warning for null value tests', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/');
			await helper.getImporterInput(page).setInputFiles({
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
				'Warning: Missing values detected in [Gender, Duration(seconds)]'
			);
		});

		test('Test if expected rows are removed', async ({ page }) => {
			await page.goto('/');
			const corruptedData = JSON.stringify(JSON.parse(jsonCorruptedTestData));

			await helper.getImporterInput(page).setInputFiles({
				name: 'test.json',
				mimeType: 'application/json',
				buffer: Buffer.from(corruptedData)
			});

			const removeMissingButton = helper.getRemoveMissingButton(page);

			await expect(page.getByText('Row_1')).toBeVisible();
			await expect(page.getByText('Row_2')).toBeVisible();
			await expect(page.getByText('Row_3')).toBeVisible();

			await removeMissingButton.click();

			await expect(page.getByText('Row_1')).not.toBeVisible();
			await expect(page.getByText('Row_2')).toBeVisible();
			await expect(page.getByText('Row_3')).not.toBeVisible();
		});
	});

	test.describe('Column modify tests', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/');
			await helper.getImporterInput(page).setInputFiles({
				name: 'example.tsv',
				mimeType: 'text/tsv',
				buffer: Buffer.from(tsvTestData)
			});

			await expect(page).toHaveURL('/modify');
		});

		test('Test renaming column', async ({ page }) => {
			const columnInput = helper.getColumnHeaderInput(page, 'Id');

			await columnInput.dblclick();
			await columnInput.fill('Test_Name');
			await helper.getFilterButton(page).click();

			await expect(helper.getColumnHeaderInput(page, 'Test_Name')).toBeVisible();
			await expect(columnInput).not.toBeVisible();
		});

		test('Test deleting column', async ({ page }) => {
			const columnDeleteButton = helper.getColumnHeaderDeleteButton(page, 'Id');
			const columnInput = helper.getColumnHeaderInput(page, 'Id');

			await columnDeleteButton.click();

			await expect(columnInput).not.toBeVisible();
			await expect(helper.getTableCell(page, '1')).not.toBeVisible();
			await expect(helper.getTableCell(page, '2')).not.toBeVisible();
			await expect(helper.getTableCell(page, '3')).not.toBeVisible();
		});
	});

	test.describe('Merge file tests', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/');
			await helper.getImporterInput(page).setInputFiles({
				name: 'example.tsv',
				mimeType: 'text/tsv',
				buffer: Buffer.from(tsvTestData)
			});

			await expect(page).toHaveURL('/modify');

			await helper.getAppendFile(page).setInputFiles({
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
			await expect(helper.getColumnOneSelect(page)).toHaveValue('0');
			await expect(helper.getColumnTwoSelect(page)).toHaveValue('0');

			const infoButton = helper.getInfoButton(page);
			await infoButton.hover();

			const tooltip = helper.getInfoBubble(page);
			await expect(tooltip).toBeVisible();
			await expect(tooltip).toContainText(/Use the Index merge to attach columns in their index/);
		});

		test('Test index merge button', async ({ page }) => {
			const indexMergeButton = helper.getMergeIndexButton(page);

			await indexMergeButton.click();

			await expect(helper.getColumnHeaderInput(page, 'Column_1')).toBeVisible();
			await expect(helper.getColumnHeaderInput(page, 'Column_2')).toBeVisible();
		});

		test('Test keyed merge button', async ({ page }) => {
			const keyedMergeButton = helper.getMergeKeyedButton(page);

			await keyedMergeButton.click();

			await expect(helper.getColumnHeaderInput(page, 'Column_1')).not.toBeVisible();
			await expect(helper.getColumnHeaderInput(page, 'Column_2')).toBeVisible();
		});

		test('Test merge with JSON file', async ({ page }) => {
			const jsonData = JSON.stringify(JSON.parse(jsonTestData));

			await helper.getAppendFile(page).setInputFiles({
				name: 'test.json',
				mimeType: 'application/json',
				buffer: Buffer.from(jsonData)
			});

			const indexMergeButton = helper.getMergeIndexButton(page);
			await indexMergeButton.click();

			await expect(helper.getColumnHeaderInput(page, 'Id')).toBeVisible();
			await expect(helper.getColumnHeaderInput(page, 'Column_1')).toBeVisible();
			await expect(helper.getColumnHeaderInput(page, 'Column_2')).toBeVisible();
		});
	});
});
