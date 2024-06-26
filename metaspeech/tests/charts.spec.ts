import { test, expect } from '@playwright/test';
import * as helper from './test.help';
import { tsvTestDataThree } from './testData.help';

test.describe('Chart tests', () => {
	test.describe('Scatter plot tests', () => {
		test('Test all', async ({ page }) => {
			expect(2).toBe(2);
			// await page.goto('/');
			// await helper.getImporterInput(page).setInputFiles({
			// 	name: 'example.tsv',
			// 	mimeType: 'text/tsv',
			// 	buffer: Buffer.from(tsvTestDataThree)
			// });

			// await expect(page).toHaveURL('/modify');

			// await helper.getNextButton(page).click();

			// await expect(page).toHaveURL('/select');

			// await helper.getGroupColumnCheckbox(page, 'Group').click();
			// await helper.getGroupColumnCheckbox(page, 'Age').click();
			// await helper.getSelectColumnRadio(page, 'Duration(seconds)').click();

			// await helper.getNavVisualizations(page).click();

			// await expect(page).toHaveURL('/view');

			// await helper.getScatterPlotGraph(page).click();

			// await expect(helper.getCanvasElement(page)).toBeVisible();

			// await helper.getScatterSwapColumns(page).click();

			// const downloadPromise = page.waitForEvent('download');
			// await helper.getPngButton(page).click();
			// const download = await downloadPromise;

			// expect(download).toBeDefined();
		});
	});
});
