import { test, expect } from '@playwright/test';
import { join } from 'path';

import * as helper from './test.help';

test.describe('Initial page tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('file input not null', async ({ page }) => {
		//get file input
		const input = await page.$('input[type=file]');
		expect(input).not.toBeNull;
	});
	test('all important elements are visible', async ({ page }) => {
		await expect(helper.getSelectData(page)).toBeVisible();
		await expect(helper.getPreviousData(page)).toBeVisible();
		await expect(helper.getStoreClientData(page)).toBeVisible();
		await expect(helper.getLogo(page)).toBeVisible();
		await expect(helper.getNavBar(page)).toBeVisible();
		await expect(helper.getFooter(page)).toBeVisible();
	});
});

test.describe('Previous data (empty) page tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await helper.getPreviousData(page).click();

		await expect(page).toHaveURL('/previous');
	});

	test('all important elements are visible', async ({ page }) => {
		await expect(helper.getNoPreviousData(page)).toBeVisible();
		await expect(helper.getClearData(page)).toBeVisible();
		await expect(helper.getPrevDataIcon(page)).toBeVisible();
		await expect(helper.getPrevDataHeading(page)).toBeVisible();
		await expect(helper.getPrevDataBackArrow(page)).toBeVisible();

		// not visible
		await expect(helper.getPrevDataInfoBuble(page)).not.toBeVisible();
		await expect(helper.getPrevDataList(page)).not.toBeVisible();
	});

	test('clear data cancel', async ({ page }) => {
		page.once('dialog', (dialog) => {
			dialog.dismiss().catch(() => {});
		});

		await helper.getClearData(page).click();
		await expect(helper.getNoPreviousData(page)).toBeVisible();
	});

	test('clear data yes', async ({ page }) => {
		page.once('dialog', (dialog) => {
			dialog.accept().catch(() => {});
		});

		await helper.getClearData(page).click();
		await expect(helper.getNoPreviousData(page)).toBeVisible();
	});

	test('icon hover', async ({ page }) => {
		await helper.getPrevDataIcon(page).hover();

		await expect(helper.getPrevDataInfoBuble(page)).toBeVisible();
	});

	test('can go back to initial page', async ({ page }) => {
		await helper.getPrevDataBackArrow(page).click();

		await expect(page).toHaveURL('/');

		await expect(helper.getNoPreviousData(page)).not.toBeVisible();
		await expect(helper.getClearData(page)).not.toBeVisible();
		await expect(helper.getPrevDataIcon(page)).not.toBeVisible();
		await expect(helper.getPrevDataHeading(page)).not.toBeVisible();
		await expect(helper.getPrevDataBackArrow(page)).not.toBeVisible();
		await expect(helper.getPrevDataInfoBuble(page)).not.toBeVisible();
		await expect(helper.getPrevDataList(page)).not.toBeVisible();
	});
});

const tsvData = `Id  Language    Age Gender  Duration (seconds)
1   EN  19  M   100
2   PT  21  F   200
3   ES  50  M   140`;

test.describe('Previous data: imported a file but did not store it', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');

		await helper.getSelectData(page).click();

		// Could also have used an actual file here, but only need a small example
		await helper.getImporterInput(page).setInputFiles({
			name: 'example.tsv',
			mimeType: 'text/tsv',
			buffer: Buffer.from(tsvData)
		}); 
		await helper.getNavHome(page).click();

		await helper.getPreviousData(page).click();

		await expect(page).toHaveURL('/previous');
	});

	test('list is still not visible (nothing stored)', async ({ page }) => {
		await expect(helper.getNoPreviousData(page)).toBeVisible();
		await expect(helper.getClearData(page)).toBeVisible();
		await expect(helper.getPrevDataIcon(page)).toBeVisible();
		await expect(helper.getPrevDataHeading(page)).toBeVisible();
		await expect(helper.getPrevDataBackArrow(page)).toBeVisible();

		// not visible
		await expect(helper.getPrevDataInfoBuble(page)).not.toBeVisible();
		await expect(helper.getPrevDataList(page)).not.toBeVisible();
	});
});

test.describe('Previous data: imported multiple files', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');

		// Import three files, store two
		for (let i = 1; i <= 3; ++i) {
			await helper.getSelectData(page).click();

			if (i === 2) {
				await helper.getStoreClientData(page).uncheck();
			} else {
				await helper.getStoreClientData(page).check();
			}

			await helper.getImporterInput(page).setInputFiles({
				name: `example${i}.tsv`,
				mimeType: 'text/tsv',
				buffer: Buffer.from(tsvData)
			}); 
			await helper.getNavHome(page).click();
		}
		
		await helper.getPreviousData(page).click();

		await expect(page).toHaveURL('/previous');
	});

	test('list is now visible with two files', async ({ page }) => {
		await expect(helper.getClearData(page)).toBeVisible();
		await expect(helper.getPrevDataIcon(page)).toBeVisible();
		await expect(helper.getPrevDataHeading(page)).toBeVisible();
		await expect(helper.getPrevDataBackArrow(page)).toBeVisible();

		await expect(helper.getPrevDataList(page)).toBeVisible();

		const lis = page.getByRole("listitem");
		
		// 2 list items
		expect(lis.all.length).toBe(2);
		expect(lis).toHaveValues(["example1.tsv", "example3.tsv"]);

		// not visible
		await expect(helper.getNoPreviousData(page)).not.toBeVisible();
		await expect(helper.getPrevDataInfoBuble(page)).not.toBeVisible();
	});
});