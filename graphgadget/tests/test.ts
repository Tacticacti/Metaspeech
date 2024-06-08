import { test, expect } from '@playwright/test';

import * as helper from './test.help';
import { tsvTestData } from './test.help';

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
		await expect(helper.getErrorModal(page)).not.toBeVisible();
	});

	test('input an invalid file format', async ({ page }) => {
		await helper.getSelectData(page).click();

		await helper.getImporterInput(page).setInputFiles({
			name: 'example.png',
			mimeType: 'image/png',
			buffer: Buffer.from('<file content>')
		});
		await expect(helper.getErrorModal(page)).toBeVisible();

		await helper.getCloseErrorModal(page).click();

		await expect(helper.getErrorModal(page)).not.toBeVisible();
		await expect(page).toHaveURL('/');
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

test.describe('Previous data: imported a file but did not store it', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');

		await helper.getSelectData(page).click();

		// Could also have used an actual file here, but only need a small example
		await helper.getImporterInput(page).setInputFiles({
			name: 'example.tsv',
			mimeType: 'text/tsv',
			buffer: Buffer.from(tsvTestData)
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
				buffer: Buffer.from(tsvTestData)
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

		// 2 list items
		expect(helper.getListItems(page)).toHaveCount(2);
		// 2 delete btns
		expect(helper.getDeleteButtons(page)).toHaveCount(2);

		await expect(helper.getPrevFileButton(page, 'example1.tsv')).toBeVisible();
		await expect(helper.getPrevFileButton(page, 'example3.tsv')).toBeVisible();
		await expect(helper.getPrevFileButton(page, 'example2.tsv')).not.toBeVisible();

		// not visible
		await expect(helper.getNoPreviousData(page)).not.toBeVisible();
		await expect(helper.getPrevDataInfoBuble(page)).not.toBeVisible();
	});

	test('delete one of them, click the other', async ({ page }) => {
		await helper.getDeleteButtons(page).nth(0).click();

		expect(helper.getListItems(page)).toHaveCount(1);
		expect(helper.getDeleteButtons(page)).toHaveCount(1);

		await expect(helper.getPrevFileButton(page, 'example3.tsv')).toBeVisible();
		await expect(helper.getPrevFileButton(page, 'example1.tsv')).not.toBeVisible();
		await expect(helper.getPrevFileButton(page, 'example2.tsv')).not.toBeVisible();

		await helper.getPrevFileButton(page, 'example3.tsv').click();

		await expect(page).toHaveURL('/modify');
	});

	test('clear data removes all', async ({ page }) => {
		// First cancel, should have no effect

		page.once('dialog', (dialog) => {
			dialog.dismiss().catch(() => {});
		});

		await helper.getClearData(page).click();

		expect(helper.getListItems(page)).toHaveCount(2);
		expect(helper.getDeleteButtons(page)).toHaveCount(2);

		await expect(helper.getPrevFileButton(page, 'example3.tsv')).toBeVisible();
		await expect(helper.getPrevFileButton(page, 'example1.tsv')).toBeVisible();
		await expect(helper.getPrevFileButton(page, 'example2.tsv')).not.toBeVisible();

		await expect(helper.getNoPreviousData(page)).not.toBeVisible();

		// Then accept, should delete two

		page.once('dialog', (dialog) => {
			dialog.accept().catch(() => {});
		});

		await helper.getClearData(page).click();

		expect(helper.getListItems(page)).toHaveCount(0);
		expect(helper.getDeleteButtons(page)).toHaveCount(0);

		await expect(helper.getPrevFileButton(page, 'example3.tsv')).not.toBeVisible();
		await expect(helper.getPrevFileButton(page, 'example1.tsv')).not.toBeVisible();
		await expect(helper.getPrevFileButton(page, 'example2.tsv')).not.toBeVisible();

		await expect(helper.getNoPreviousData(page)).toBeVisible();
		await expect(helper.getPrevDataList(page)).not.toBeVisible();
	});
});
