import { test, expect } from '@playwright/test';

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

		// bubble not visible
		await expect(helper.getPrevDataInfoBuble(page)).not.toBeVisible();
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
	});
});
